"""Parse the supplied 531-image brief and build a resumable generation queue."""

from __future__ import annotations

import argparse
import hashlib
import json
import pathlib
import re
from datetime import datetime, timezone
from typing import Any

HEADING_RE = re.compile(r"^###\s+(\S+).*?·\s+рівень\s+(\S+)\s+·\s+(\d+)\s+шт\.(.*)$")
ITEM_RE = re.compile(r"^([^|]+\.png)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|\s*(.+)$")

ACTION_CATEGORIES = {"fritid", "retning", "helse3", "rydding"}
ABSTRACT_CATEGORIES = {"sporreord", "digital", "rettigheter", "tilbud", "offentlig"}
PEOPLE_CATEGORIES = {"familie", "yrker", "folk", "barn", "foreldre"}
NUMBER_CATEGORIES = {"tall2"}
DIRECTION_WORDS = {
    "her", "der", "foran", "bak", "over", "under", "ved siden av", "mellom",
    "inne", "ute", "oppe", "nede", "til høyre", "til venstre", "rett fram",
    "langt", "nær", "rundt", "gjennom", "tilbake",
}

STYLE = (
    "Colorful premium 3D cartoon educational icon, soft rounded shapes, beautiful realistic "
    "materials, vibrant colors, professional studio lighting, subtle ambient occlusion, "
    "polished mobile learning app aesthetic"
)
OUTPUT_RULES = (
    "centered composition, one main subject, full object visible with generous 10 percent safe "
    "margins on every side, crisp clean silhouette, isolated on a genuine transparent background, "
    "512x512 RGBA PNG, no text, no letters, no digits, no caption, no watermark, no border, "
    "no checkerboard background, no cropped parts, no unrelated objects"
)


def parse_brief(text: str) -> tuple[list[dict[str, Any]], list[dict[str, Any]]]:
    items: list[dict[str, Any]] = []
    sections: list[dict[str, Any]] = []
    current: dict[str, Any] | None = None
    for raw in text.splitlines():
        line = raw.strip()
        heading = HEADING_RE.match(line)
        if heading:
            current = {
                "category": heading.group(1),
                "level": heading.group(2),
                "declaredCount": int(heading.group(3)),
                "repaint": "ПЕРЕМАЛЮВАТИ" in heading.group(4),
                "actualCount": 0,
            }
            sections.append(current)
            continue
        match = ITEM_RE.match(line)
        if match and current:
            filename, norwegian, english, ukrainian = (part.strip() for part in match.groups())
            item = {
                "category": current["category"],
                "level": current["level"],
                "filename": filename,
                "norwegian": norwegian,
                "english": english,
                "ukrainian": ukrainian,
                "repaint": current["repaint"],
            }
            items.append(item)
            current["actualCount"] += 1

    errors = [
        f"{section['category']}: declared {section['declaredCount']}, parsed {section['actualCount']}"
        for section in sections
        if section["declaredCount"] != section["actualCount"]
    ]
    keys = [f"{item['category']}/{item['filename']}" for item in items]
    duplicates = sorted({key for key in keys if keys.count(key) > 1})
    if errors or duplicates:
        details = "; ".join(errors + [f"duplicate: {value}" for value in duplicates])
        raise ValueError(details)
    return items, sections


def prompt_for(item: dict[str, Any]) -> str:
    norwegian = item["norwegian"]
    english = item["english"]
    ukrainian = item["ukrainian"]
    category = item["category"]
    bare = re.sub(r"^(en|ei|et|å)\s+", "", norwegian).strip()
    is_verb = norwegian.startswith("å ")

    if bare in DIRECTION_WORDS:
        subject = (
            f"A friendly child in a blue hoodie demonstrating the direction or place concept "
            f"“{english}” with one large clear glossy 3D arrow or spatial prop; the gesture and "
            "position must make the meaning immediately recognizable"
        )
    elif category in NUMBER_CATEGORIES:
        subject = (
            f"A simple child-friendly visual metaphor for the quantity concept “{english}”; "
            "use a clear group or divided object that communicates the amount without written numerals"
        )
    elif category in ABSTRACT_CATEGORIES:
        subject = (
            f"A simple immediately understandable scene-symbol for “{english}” "
            f"({norwegian}, {ukrainian}); use a friendly child in a blue hoodie when a person helps "
            "communicate the idea, with blank props and screens"
        )
    elif is_verb or category in ACTION_CATEGORIES:
        subject = (
            f"A friendly child in a blue hoodie or a girl in a purple sweater clearly performing "
            f"the single action “{english}” ({norwegian}, {ukrainian}); one readable pose"
        )
    elif category in PEOPLE_CATEGORIES:
        subject = (
            f"A friendly 3D cartoon person clearly representing “{english}” "
            f"({norwegian}, {ukrainian}), full body visible, warm age-appropriate expression"
        )
    elif category == "farger":
        subject = (
            f"One simple glossy rounded learning object whose material clearly shows the color "
            f"“{english}” ({norwegian}), without labels"
        )
    elif category == "adjektiv":
        subject = (
            f"One child-friendly object or character clearly showing only the property “{english}” "
            f"({norwegian}, {ukrainian}), without showing the opposite for comparison"
        )
    else:
        subject = (
            f"One clear culturally accurate visual representation of “{english}” "
            f"({norwegian}, {ukrainian}), recognizable to a child without a caption"
        )

    return f"{subject}. {STYLE}, {OUTPUT_RULES}."


def build_queue(input_path: pathlib.Path, root: pathlib.Path) -> dict[str, Any]:
    root = root.resolve()
    text = input_path.read_text(encoding="utf-8")
    items, sections = parse_brief(text)
    if len(items) != 531:
        raise ValueError(f"expected 531 items, parsed {len(items)}")

    timestamp = datetime.now(timezone.utc).isoformat()
    queue_items = []
    for item in items:
        key = f"{item['category']}/{item['filename']}"
        queue_items.append({
            "id": hashlib.sha256(key.encode("utf-8")).hexdigest()[:16],
            **item,
            "generatedPath": f"img/words/{key}",
            "prompt": prompt_for(item),
            "status": "pending",
            "attempts": 0,
            "error": None,
            "updatedAt": None,
        })

    payload = {
        "version": 1,
        "source": str(input_path),
        "createdAt": timestamp,
        "batchSize": 20,
        "stats": {
            "total": len(queue_items),
            "categories": len(sections),
            "pending": len(queue_items),
            "generated": 0,
            "failed": 0,
            "repaintRequired": sum(item["repaint"] for item in queue_items),
        },
        "sections": sections,
        "items": queue_items,
    }
    reports = root / "reports"
    reports.mkdir(parents=True, exist_ok=True)
    (reports / "requested-image-spec-531.json").write_text(
        json.dumps(
            {
                "version": 1,
                "createdAt": timestamp,
                "total": len(items),
                "categories": len(sections),
                "sections": sections,
                "items": items,
            },
            ensure_ascii=False,
            indent=2,
        ) + "\n",
        encoding="utf-8",
    )
    (reports / "requested-image-queue-531.json").write_text(
        json.dumps(payload, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    (reports / "requested-image-prompts-531.txt").write_text(
        "\n\n".join(
            f"{item['category']}/{item['filename']}\n"
            f"{item['norwegian']} | {item['english']} | {item['ukrainian']}\n"
            f"{item['prompt']}"
            for item in queue_items
        ) + "\n",
        encoding="utf-8",
    )
    return payload


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("input", type=pathlib.Path)
    parser.add_argument(
        "root", nargs="?", type=pathlib.Path,
        default=pathlib.Path(__file__).resolve().parents[1],
    )
    args = parser.parse_args()
    payload = build_queue(args.input, args.root)
    print(json.dumps(payload["stats"], ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()

