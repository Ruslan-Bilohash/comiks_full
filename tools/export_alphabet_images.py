"""Build a verified Komiks·Lab Norwegian alphabet image pack."""

from __future__ import annotations

import argparse
import json
import pathlib
import sys
import zipfile
from datetime import datetime, timezone
from typing import Any

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from validate_word_images import inspect_image, prepare_generated_image

ALPHABET = [
    ("A", "a", "ape", "мавпа", "monkey", "Friendly brown monkey sitting upright with its full body and curled tail visible"),
    ("B", "be", "bil", "автомобіль", "car", "Cheerful compact red family car shown in a clean three-quarter view"),
    ("C", "se", "cowboy", "ковбой", "cowboy", "Friendly child-safe cowboy wearing a wide hat, boots and a neckerchief, full body visible"),
    ("D", "de", "dør", "двері", "door", "Traditional Norwegian wooden front door with a round handle"),
    ("E", "e", "eple", "яблуко", "apple", "Fresh shiny red apple with one green leaf"),
    ("F", "eff", "fisk", "риба", "fish", "Friendly colorful fish swimming in profile, full body and fins visible"),
    ("G", "ge", "gris", "свиня", "pig", "Friendly pink pig standing, full body visible"),
    ("H", "hå", "hus", "будинок", "house", "Cozy Norwegian wooden house with a red facade and dark roof"),
    ("I", "i", "is", "морозиво", "ice cream", "Single strawberry and vanilla ice cream cone"),
    ("J", "je", "jente", "дівчинка", "girl", "Friendly school-age girl waving, full body visible"),
    ("K", "kå", "katt", "кіт", "cat", "Friendly orange cat sitting with its tail visible"),
    ("L", "ell", "løve", "лев", "lion", "Friendly golden lion with a soft rounded mane, full body visible"),
    ("M", "emm", "melk", "молоко", "milk", "Small glass bottle of fresh milk with a plain cap and no label"),
    ("N", "enn", "nese", "ніс", "nose", "Simple friendly human nose as a clear anatomy learning icon"),
    ("O", "o", "ost", "сир", "cheese", "Single wedge of yellow cheese with round holes"),
    ("P", "pe", "pære", "груша", "pear", "Fresh green pear with a small leaf"),
    ("Q", "ku", "quiz", "вікторина", "quiz", "Colorful game-show quiz buzzer on a small podium with no symbols or writing"),
    ("R", "ærr", "regn", "дощ", "rain", "Single soft gray rain cloud with clear blue raindrops"),
    ("S", "ess", "sol", "сонце", "sun", "Warm smiling golden sun with rounded rays"),
    ("T", "te", "tog", "потяг", "train", "Friendly modern Norwegian passenger train shown in three-quarter view"),
    ("U", "u", "ugle", "сова", "owl", "Friendly brown owl perched upright, full body visible"),
    ("V", "ve", "vann", "вода", "water", "Single crystal-clear blue water droplet"),
    ("W", "dobbelt-ve", "wienerbrød", "булочка", "Danish pastry", "Single golden flaky Norwegian-style Danish pastry swirl"),
    ("X", "eks", "xylofon", "ксилофон", "xylophone", "Colorful child-safe toy xylophone with two small mallets"),
    ("Y", "y", "yoghurt", "йогурт", "yoghurt", "Plain bowl of creamy yoghurt with a small spoon and no label"),
    ("Z", "sett", "zebra", "зебра", "zebra", "Friendly zebra standing in profile, full body visible"),
    ("Æ", "æ", "ærme", "рукав", "sleeve", "Single blue shirt sleeve with a neat cuff, detached garment detail"),
    ("Ø", "ø", "øre", "вухо", "ear", "Simple friendly human ear as a clear anatomy learning icon"),
    ("Å", "å", "åtte", "вісім", "eight", "Single glossy rounded numeral eight as a playful learning object"),
]

FILE_PARTS = {"Æ": "ae_aerme", "Ø": "oe_oere", "Å": "aa_aatte"}


def filename_for(letter: str, word: str) -> str:
    if letter in FILE_PARTS:
        return FILE_PARTS[letter] + ".png"
    stem = word.replace("ø", "o").replace("æ", "ae").replace("å", "aa")
    return f"{letter.lower()}_{stem}.png"


def prompt_for(subject: str) -> str:
    return (
        f"{subject}. Colorful premium 3D cartoon educational icon, soft rounded shapes, "
        "beautiful realistic materials, vibrant colors, professional studio lighting, "
        "subtle ambient occlusion, polished mobile learning app aesthetic, centered composition, "
        "isolated object on a genuine transparent background, full object visible with generous "
        "10 percent safe margins on every side, crisp clean silhouette, 512x512 RGBA PNG, "
        "no unrelated objects, no watermark, no border, no text or letters."
    )


def _pick_source(entries: list[dict[str, Any]], word: str, english: str) -> dict[str, Any] | None:
    candidates = [
        item for item in entries
        if item.get("normalized") == word
        and item.get("status") in {"existing-raster", "generated"}
        and item.get("validation", {}).get("status") == "valid"
        and not str(item.get("image", "")).startswith("inline-svg:")
    ]
    if not candidates:
        return None

    def score(item: dict[str, Any]) -> tuple[int, int, int]:
        item_english = str(item.get("english", "")).lower()
        exact_meaning = int(english.lower() in item_english or item_english in english.lower())
        generated = int(item.get("status") == "generated")
        png = int(str(item.get("image", "")).lower().endswith(".png"))
        return exact_meaning, generated, png

    return max(candidates, key=score)


def _write_prompts(items: list[dict[str, Any]]) -> str:
    return "\n\n".join(
        f"{item['letter']} {item['word']}\nFile: {item['filename']}\nPrompt: {item['prompt']}"
        for item in items
    ) + "\n"


def build_alphabet_pack(root: pathlib.Path) -> dict[str, Any]:
    root = root.resolve()
    audit = json.loads((root / "reports" / "image-audit.json").read_text(encoding="utf-8"))
    entries = audit.get("entries", [])
    image_dir = root / "img" / "alphabet"
    report_dir = root / "reports"
    export_dir = root / "exports"
    image_dir.mkdir(parents=True, exist_ok=True)
    report_dir.mkdir(parents=True, exist_ok=True)
    export_dir.mkdir(parents=True, exist_ok=True)

    items: list[dict[str, Any]] = []
    for letter, pronunciation, word, ukrainian, english, subject in ALPHABET:
        filename = filename_for(letter, word)
        output_rel = f"img/alphabet/{filename}"
        output_path = root / output_rel
        source = _pick_source(entries, word, english)
        item: dict[str, Any] = {
            "id": f"alphabet_{letter.lower()}",
            "letter": letter,
            "pronunciation": pronunciation,
            "word": word,
            "ukrainian": ukrainian,
            "english": english,
            "filename": filename,
            "image": output_rel,
            "prompt": prompt_for(subject),
            "status": "pending",
            "needsGeneration": True,
            "source": None,
            "validation": {"status": "missing", "problems": ["missing-file"]},
        }
        if source:
            source_path = root / str(source["image"])
            try:
                prepare_generated_image(source_path, output_path)
                validation = inspect_image(output_path, generated=True)
                item["validation"] = validation
                if validation["status"] == "valid":
                    item["status"] = "reused"
                    item["needsGeneration"] = False
                    item["source"] = str(source["image"]).replace("\\", "/")
            except (OSError, ValueError) as error:
                item["validation"] = {"status": "invalid", "problems": [str(error)]}
        items.append(item)

    timestamp = datetime.now(timezone.utc).isoformat()
    ready = [item for item in items if item["status"] == "reused"]
    pending = [item for item in items if item["needsGeneration"]]
    report = {
        "version": 1,
        "generatedAt": timestamp,
        "total": len(items),
        "ready": len(ready),
        "pending": len(pending),
        "complete": not pending,
        "items": items,
    }
    (report_dir / "alphabet-image-audit.json").write_text(
        json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    queue = {
        "version": 1,
        "createdAt": timestamp,
        "batchSize": 20,
        "stats": {"total": len(items), "pending": len(pending), "reused": len(ready)},
        "items": [
            {
                "id": item["id"],
                "letter": item["letter"],
                "word": item["word"],
                "ukrainian": item["ukrainian"],
                "english": item["english"],
                "filename": item["filename"],
                "generatedPath": item["image"],
                "prompt": item["prompt"],
                "status": "pending",
                "attempts": 0,
                "error": None,
            }
            for item in pending
        ],
    }
    (report_dir / "alphabet-generation-queue.json").write_text(
        json.dumps(queue, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )

    manifest = {
        "generatedAt": timestamp,
        "title": "Komiks·LAB Norwegian alphabet images",
        "total": len(items),
        "images": len(ready),
        "pending": len(pending),
        "complete": not pending,
        "items": [
            {
                key: item[key]
                for key in (
                    "letter", "pronunciation", "word", "ukrainian", "english",
                    "filename", "image", "status", "needsGeneration", "source", "prompt", "validation"
                )
            }
            for item in items
        ],
    }
    archive_path = export_dir / "Komiks_LAB_ALPHABET_512.zip"
    with zipfile.ZipFile(archive_path, "w", zipfile.ZIP_DEFLATED) as archive:
        for item in ready:
            archive.write(root / item["image"], item["filename"])
        archive.writestr(
            "manifest.json",
            json.dumps(manifest, ensure_ascii=False, indent=2).encode("utf-8"),
        )
        archive.writestr("prompts.txt", _write_prompts(items).encode("utf-8"))

    return {
        "archive": str(archive_path),
        "total": len(items),
        "images": len(ready),
        "pending": len(pending),
        "complete": not pending,
        "pendingWords": [item["word"] for item in pending],
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "root", nargs="?", type=pathlib.Path,
        default=pathlib.Path(__file__).resolve().parents[1],
    )
    args = parser.parse_args()
    print(json.dumps(build_alphabet_pack(args.root), ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()

