"""Validate every raster referenced by the Komiks·Lab word audit."""

from __future__ import annotations

import argparse
import hashlib
import json
import pathlib
from typing import Any

from PIL import Image, UnidentifiedImageError


def prepare_generated_image(source: pathlib.Path, output: pathlib.Path) -> None:
    """Trim a generated transparent image and fit it on a 512px RGBA canvas."""
    with Image.open(source) as opened:
        opened.load()
        if "A" not in opened.mode:
            raise ValueError("generated image has no alpha channel")
        rgba = opened.convert("RGBA")
    alpha = rgba.getchannel("A")
    if alpha.getextrema()[0] == 255:
        raise ValueError("generated image has no transparent pixels")
    bbox = alpha.getbbox()
    if not bbox:
        raise ValueError("generated image is empty")
    subject = rgba.crop(bbox)
    scale = min(400 / subject.width, 400 / subject.height)
    size = (max(1, round(subject.width * scale)), max(1, round(subject.height * scale)))
    subject = subject.resize(size, Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", (512, 512), (0, 0, 0, 0))
    canvas.alpha_composite(subject, ((512 - size[0]) // 2, (512 - size[1]) // 2))
    output.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(output, "PNG", optimize=True)


def inspect_image(path: pathlib.Path, generated: bool = False) -> dict[str, Any]:
    result: dict[str, Any] = {
        "status": "invalid",
        "format": None,
        "width": 0,
        "height": 0,
        "mode": None,
        "hasAlpha": False,
        "safeMargins": [0.0, 0.0, 0.0, 0.0],
        "pixelHash": None,
        "problems": [],
    }
    if not path.is_file():
        result["status"] = "missing"
        result["problems"] = ["missing-file"]
        return result
    try:
        with Image.open(path) as source:
            source.load()
            result.update(format=source.format, width=source.width, height=source.height, mode=source.mode)
            rgba = source.convert("RGBA")
    except (UnidentifiedImageError, OSError, ValueError):
        result["status"] = "corrupt"
        result["problems"] = ["decode"]
        return result

    alpha = rgba.getchannel("A")
    extrema = alpha.getextrema()
    result["hasAlpha"] = "A" in str(result["mode"]) and extrema[0] < 255
    bbox = alpha.getbbox()
    if bbox:
        left, top, right, bottom = bbox
        result["safeMargins"] = [
            round(left / rgba.width, 4),
            round(top / rgba.height, 4),
            round((rgba.width - right) / rgba.width, 4),
            round((rgba.height - bottom) / rgba.height, 4),
        ]
    result["pixelHash"] = hashlib.sha256(
        f"{rgba.width}x{rgba.height}:".encode("ascii") + rgba.tobytes()
    ).hexdigest()

    problems: list[str] = []
    if generated and (result["format"] != "PNG" or rgba.size != (512, 512)):
        problems.append("dimensions" if rgba.size != (512, 512) else "format")
    if not result["hasAlpha"]:
        problems.append("alpha")
    if not bbox:
        problems.append("empty")
    if generated and bbox and min(result["safeMargins"]) < 0.095:
        problems.append("safe-margin")
    result["problems"] = problems
    result["status"] = "valid" if not problems else "invalid"
    return result


def validate_report(root: pathlib.Path, report: dict[str, Any]) -> dict[str, Any]:
    root = root.resolve()
    seen_hashes: dict[str, str] = {}
    for entry in report.get("entries", []):
        current = str(entry.get("image") or "")
        generated_path = str(entry.get("generatedPath") or "")
        candidate = current
        generated = entry.get("sourceType") == "generated-png"
        if entry.get("needsGeneration") and generated_path and (root / generated_path).is_file():
            candidate = generated_path
            generated = True
        if candidate.startswith("inline-svg:"):
            entry["validation"] = {"status": "inline-svg", "problems": []}
            entry["status"] = "existing-inline-svg"
            continue
        if not candidate:
            entry["validation"] = {"status": "missing", "problems": ["missing-path"]}
            entry["status"] = "missing"
            entry["needsGeneration"] = True
            continue

        validation = inspect_image(root / candidate, generated=generated)
        entry["validation"] = validation
        if validation["status"] == "valid":
            entry["image"] = candidate.replace("\\", "/")
            entry["status"] = "generated" if generated else "existing-raster"
            entry["sourceType"] = "generated-png" if generated else "raster"
            entry["needsGeneration"] = False
            pixel_hash = validation.get("pixelHash")
            if pixel_hash in seen_hashes:
                entry["duplicateOf"] = seen_hashes[pixel_hash]
            elif pixel_hash:
                seen_hashes[pixel_hash] = str(entry.get("id"))
        else:
            entry["status"] = validation["status"]
            entry["needsGeneration"] = True
    report["validationSummary"] = {
        "validRaster": sum(e.get("status") in {"existing-raster", "generated"} for e in report.get("entries", [])),
        "inlineSvg": sum(e.get("status") == "existing-inline-svg" for e in report.get("entries", [])),
        "missingOrInvalid": sum(bool(e.get("needsGeneration")) for e in report.get("entries", [])),
        "duplicates": sum("duplicateOf" in e for e in report.get("entries", [])),
    }
    return report


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("root", type=pathlib.Path)
    parser.add_argument("report", nargs="?", type=pathlib.Path)
    args = parser.parse_args()
    report_path = args.report or args.root / "reports/image-audit.json"
    report = json.loads(report_path.read_text(encoding="utf-8"))
    validate_report(args.root, report)
    report_path.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    summary = report["validationSummary"]
    print(
        f"Validated {summary['validRaster']} rasters and {summary['inlineSvg']} inline SVG images; "
        f"{summary['missingOrInvalid']} entries need generation; {summary['duplicates']} duplicate references."
    )


if __name__ == "__main__":
    main()

