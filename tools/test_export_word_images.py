import json
import tempfile
import unittest
import zipfile
from pathlib import Path

from export_word_images import export_images


class ExportWordImagesTests(unittest.TestCase):
    def test_exports_category_and_all_archives_with_metadata(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            (root / "reports").mkdir()
            image = root / "img" / "words" / "dyr" / "hund.png"
            image.parent.mkdir(parents=True)
            image.write_bytes(b"fake-png")
            queue = {
                "items": [{
                    "id": "asset-1", "category": "dyr", "norwegian": "en hund",
                    "ukrainian": "собака", "english": "dog", "filename": "hund.png",
                    "generatedPath": "img/words/dyr/hund.png", "prompt": "Friendly dog",
                    "wordIds": ["dyr_001"], "status": "generated"
                }]
            }
            (root / "reports" / "image-generation-queue.json").write_text(
                json.dumps(queue, ensure_ascii=False), encoding="utf-8"
            )

            summary = export_images(root)

            self.assertEqual(summary["images"], 1)
            with zipfile.ZipFile(root / "exports" / "dyr.zip") as archive:
                self.assertEqual(
                    sorted(archive.namelist()),
                    ["hund.png", "manifest.json", "prompts.txt"]
                )
                manifest = json.loads(archive.read("manifest.json"))
                self.assertEqual(manifest["items"][0]["norwegian"], "en hund")
            with zipfile.ZipFile(root / "exports" / "Komiks_LAB_ALL_IMAGES_512.zip") as archive:
                self.assertIn("dyr/hund.png", archive.namelist())
                self.assertIn("manifest.json", archive.namelist())

    def test_skips_missing_generated_files_and_reports_them(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            (root / "reports").mkdir()
            queue = {"items": [{
                "id": "missing", "category": "dyr", "filename": "hund.png",
                "generatedPath": "img/words/dyr/hund.png", "prompt": "dog",
                "status": "generated"
            }]}
            (root / "reports" / "image-generation-queue.json").write_text(
                json.dumps(queue), encoding="utf-8"
            )
            summary = export_images(root)
            self.assertEqual(summary["images"], 0)
            self.assertEqual(summary["missingFiles"], ["img/words/dyr/hund.png"])


if __name__ == "__main__":
    unittest.main()
