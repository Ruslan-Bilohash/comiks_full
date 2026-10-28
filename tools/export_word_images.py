import json
import sys
import zipfile
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path


def _manifest_item(item):
    return {
        key: item.get(key)
        for key in (
            "id", "wordIds", "category", "norwegian", "ukrainian", "english",
            "filename", "generatedPath", "prompt"
        )
    }


def _json_bytes(value):
    return json.dumps(value, ensure_ascii=False, indent=2).encode("utf-8")


def _prompt_text(items):
    blocks = []
    for item in items:
        blocks.append(
            f"{item.get('norwegian', item['filename'])}\n"
            f"File: {item['filename']}\n"
            f"Prompt: {item.get('prompt', '')}"
        )
    return ("\n\n".join(blocks) + "\n").encode("utf-8")


def export_images(root):
    root = Path(root).resolve()
    queue_path = root / "reports" / "image-generation-queue.json"
    queue = json.loads(queue_path.read_text(encoding="utf-8"))
    export_dir = root / "exports"
    export_dir.mkdir(parents=True, exist_ok=True)
    grouped = defaultdict(list)
    missing = []
    for item in queue.get("items", []):
        if item.get("status") != "generated":
            continue
        image_path = root / item["generatedPath"]
        if not image_path.is_file():
            missing.append(item["generatedPath"])
            continue
        grouped[item["category"]].append((item, image_path))

    timestamp = datetime.now(timezone.utc).isoformat()
    for category, pairs in sorted(grouped.items()):
        items = [pair[0] for pair in pairs]
        manifest = {
            "generatedAt": timestamp,
            "category": category,
            "count": len(items),
            "items": [_manifest_item(item) for item in items],
        }
        with zipfile.ZipFile(export_dir / f"{category}.zip", "w", zipfile.ZIP_DEFLATED) as archive:
            for item, image_path in pairs:
                archive.write(image_path, item["filename"])
            archive.writestr("prompts.txt", _prompt_text(items))
            archive.writestr("manifest.json", _json_bytes(manifest))

    all_items = [pair for category in sorted(grouped) for pair in grouped[category]]
    all_manifest = {
        "generatedAt": timestamp,
        "count": len(all_items),
        "categories": sorted(grouped),
        "items": [_manifest_item(item) for item, _ in all_items],
    }
    with zipfile.ZipFile(
        export_dir / "Komiks_LAB_ALL_IMAGES_512.zip", "w", zipfile.ZIP_DEFLATED
    ) as archive:
        for item, image_path in all_items:
            archive.write(image_path, f"{item['category']}/{item['filename']}")
        archive.writestr("prompts.txt", _prompt_text([item for item, _ in all_items]))
        archive.writestr("manifest.json", _json_bytes(all_manifest))

    summary = {
        "categories": len(grouped),
        "images": len(all_items),
        "missingFiles": missing,
    }
    (export_dir / "export-summary.json").write_text(
        json.dumps(summary, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    return summary


if __name__ == "__main__":
    project_root = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(__file__).resolve().parents[1]
    print(json.dumps(export_images(project_root), ensure_ascii=False, indent=2))
