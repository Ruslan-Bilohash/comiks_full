import json
import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from importlib.machinery import SourceFileLoader

MODULE = SourceFileLoader(
    "requested_queue",
    str(Path(__file__).resolve().parent / "build-requested-image-queue.py"),
).load_module()


class RequestedImageQueueTests(unittest.TestCase):
    def test_parses_sections_and_builds_distinct_category_paths(self):
        text = """### one — One · рівень A1 · 2 шт. · ПЕРЕМАЛЮВАТИ ВСЮ ТЕМУ
same.png | en ting | a thing | річ
gaa.png | å gå | to walk | іти
### two — Two · рівень A2 · 1 шт.
same.png | et kort | a card | картка
"""
        items, sections = MODULE.parse_brief(text)
        self.assertEqual(len(items), 3)
        self.assertEqual(len(sections), 2)
        self.assertTrue(items[0]["repaint"])
        self.assertFalse(items[2]["repaint"])
        self.assertNotEqual(
            f"{items[0]['category']}/{items[0]['filename']}",
            f"{items[2]['category']}/{items[2]['filename']}",
        )

    def test_rejects_declared_count_mismatch(self):
        text = """### one — One · рівень A1 · 2 шт.
one.png | en ting | a thing | річ
"""
        with self.assertRaisesRegex(ValueError, "declared 2, parsed 1"):
            MODULE.parse_brief(text)

    def test_prompts_enforce_transparency_and_no_text(self):
        prompt = MODULE.prompt_for({
            "category": "retning",
            "filename": "til_hoyre.png",
            "norwegian": "til høyre",
            "english": "to the right",
            "ukrainian": "праворуч",
            "repaint": False,
        })
        self.assertIn("transparent background", prompt)
        self.assertIn("512x512 RGBA PNG", prompt)
        self.assertIn("no text", prompt)
        self.assertIn("10 percent safe margins", prompt)
        self.assertIn("blue hoodie", prompt)


if __name__ == "__main__":
    unittest.main()

