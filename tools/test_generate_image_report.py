import json
import tempfile
import unittest
from pathlib import Path

from generate_image_report import generate_report


class GenerateImageReportTests(unittest.TestCase):
    def test_report_uses_actual_audit_and_queue_counts(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            (root / "reports").mkdir()
            audit = {
                "generatedAt": "now", "themes": [{"id": "dyr"}],
                "entries": [
                    {"id": "1", "category": "dyr", "norwegian": "en hund", "ukrainian": "собака", "status": "generated", "needsGeneration": False},
                    {"id": "2", "category": "dyr", "norwegian": "en katt", "ukrainian": "кіт", "status": "missing", "needsGeneration": True},
                ],
                "validationSummary": {"validRaster": 1, "inlineSvg": 0, "missingOrInvalid": 1, "duplicates": 0},
            }
            queue = {"items": [
                {"id": "a", "status": "generated"},
                {"id": "b", "status": "pending"},
            ]}
            (root / "reports" / "image-audit.json").write_text(json.dumps(audit), encoding="utf-8")
            (root / "reports" / "image-generation-queue.json").write_text(json.dumps(queue), encoding="utf-8")

            result = generate_report(root)
            text = result.read_text(encoding="utf-8")

            self.assertIn("| Усього словникових записів | 2 |", text)
            self.assertIn("| Нових унікальних PNG | 1 |", text)
            self.assertIn("en katt", text)

    def test_accepts_numeric_theme_count_from_real_audit_format(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            (root / "reports").mkdir()
            audit = {"themes": 54, "entries": [], "validationSummary": {}}
            queue = {"items": []}
            (root / "reports" / "image-audit.json").write_text(json.dumps(audit), encoding="utf-8")
            (root / "reports" / "image-generation-queue.json").write_text(json.dumps(queue), encoding="utf-8")
            text = generate_report(root).read_text(encoding="utf-8")
            self.assertIn("| Категорій | 54 |", text)


if __name__ == "__main__":
    unittest.main()
