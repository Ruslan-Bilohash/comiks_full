import json
import sys
import tempfile
import unittest
import zipfile
from pathlib import Path

from PIL import Image

sys.path.insert(0, str(Path(__file__).resolve().parent))
from export_alphabet_images import build_alphabet_pack


class ExportAlphabetImagesTests(unittest.TestCase):
    def test_builds_verified_partial_pack_and_generation_queue(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            (root / "reports").mkdir()
            source = root / "img" / "words" / "dyr" / "ape.webp"
            source.parent.mkdir(parents=True)
            image = Image.new("RGBA", (300, 300), (0, 0, 0, 0))
            for x in range(50, 250):
                for y in range(50, 250):
                    image.putpixel((x, y), (120, 80, 40, 255))
            image.save(source, "WEBP")
            audit = {
                "entries": [{
                    "id": "dyr_ape",
                    "normalized": "ape",
                    "english": "monkey",
                    "image": "img/words/dyr/ape.webp",
                    "status": "existing-raster",
                    "validation": {"status": "valid"},
                }]
            }
            (root / "reports" / "image-audit.json").write_text(
                json.dumps(audit), encoding="utf-8"
            )

            summary = build_alphabet_pack(root)

            self.assertEqual(summary["total"], 29)
            self.assertEqual(summary["images"], 1)
            self.assertEqual(summary["pending"], 28)
            output = root / "img" / "alphabet" / "a_ape.png"
            with Image.open(output) as rendered:
                self.assertEqual(rendered.size, (512, 512))
                self.assertEqual(rendered.mode, "RGBA")
            queue = json.loads(
                (root / "reports" / "alphabet-generation-queue.json").read_text(encoding="utf-8")
            )
            self.assertEqual(queue["stats"]["pending"], 28)
            with zipfile.ZipFile(root / "exports" / "Komiks_LAB_ALPHABET_512.zip") as archive:
                self.assertIn("a_ape.png", archive.namelist())
                self.assertIn("manifest.json", archive.namelist())
                self.assertIn("prompts.txt", archive.namelist())
                manifest = json.loads(archive.read("manifest.json"))
                self.assertFalse(manifest["complete"])
                self.assertEqual(manifest["total"], 29)

    def test_special_letter_filenames_are_ascii_and_stable(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            (root / "reports").mkdir()
            (root / "reports" / "image-audit.json").write_text(
                '{"entries":[]}', encoding="utf-8"
            )
            build_alphabet_pack(root)
            queue = json.loads(
                (root / "reports" / "alphabet-generation-queue.json").read_text(encoding="utf-8")
            )
            filenames = {item["letter"]: item["filename"] for item in queue["items"]}
            self.assertEqual(filenames["Æ"], "ae_aerme.png")
            self.assertEqual(filenames["Ø"], "oe_oere.png")
            self.assertEqual(filenames["Å"], "aa_aatte.png")


if __name__ == "__main__":
    unittest.main()

