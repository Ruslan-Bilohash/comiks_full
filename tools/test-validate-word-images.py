import json
import pathlib
import tempfile
import unittest

from PIL import Image, ImageDraw

import validate_word_images as validator


class WordImageValidatorTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.root = pathlib.Path(self.temp.name)
        (self.root / "img/words/test").mkdir(parents=True)

    def tearDown(self):
        self.temp.cleanup()

    def make_rgba(self, name, size=(512, 512), box=(64, 64, 448, 448), color=(255, 80, 40, 255)):
        image = Image.new("RGBA", size, (0, 0, 0, 0))
        ImageDraw.Draw(image).ellipse(box, fill=color)
        path = self.root / "img/words/test" / name
        image.save(path)
        return path

    def test_valid_generated_png(self):
        path = self.make_rgba("valid.png")
        result = validator.inspect_image(path, generated=True)
        self.assertEqual(result["status"], "valid")
        self.assertEqual(result["width"], 512)
        self.assertTrue(result["hasAlpha"])
        self.assertGreaterEqual(min(result["safeMargins"]), 0.10)

    def test_wrong_size_is_rejected_for_generated_asset(self):
        path = self.make_rgba("small.png", size=(300, 300), box=(40, 40, 260, 260))
        result = validator.inspect_image(path, generated=True)
        self.assertEqual(result["status"], "invalid")
        self.assertIn("dimensions", result["problems"])

    def test_rgb_without_alpha_is_rejected(self):
        path = self.root / "img/words/test/opaque.png"
        Image.new("RGB", (512, 512), "red").save(path)
        result = validator.inspect_image(path, generated=True)
        self.assertIn("alpha", result["problems"])

    def test_empty_image_is_rejected(self):
        path = self.root / "img/words/test/empty.png"
        Image.new("RGBA", (512, 512), (0, 0, 0, 0)).save(path)
        result = validator.inspect_image(path, generated=True)
        self.assertIn("empty", result["problems"])

    def test_clipped_image_is_rejected(self):
        path = self.make_rgba("clipped.png", box=(0, 40, 500, 470))
        result = validator.inspect_image(path, generated=True)
        self.assertIn("safe-margin", result["problems"])

    def test_corrupt_file_is_rejected(self):
        path = self.root / "img/words/test/corrupt.png"
        path.write_bytes(b"not png")
        result = validator.inspect_image(path, generated=True)
        self.assertEqual(result["status"], "corrupt")

    def test_duplicate_content_is_reported(self):
        first = self.make_rgba("one.png")
        second = self.root / "img/words/test/two.png"
        second.write_bytes(first.read_bytes())
        report = {
            "entries": [
                {"id": "a", "image": "img/words/test/one.png", "sourceType": "raster", "needsGeneration": False},
                {"id": "b", "image": "img/words/test/two.png", "sourceType": "raster", "needsGeneration": False},
            ]
        }
        updated = validator.validate_report(self.root, report)
        self.assertEqual(updated["entries"][1]["duplicateOf"], "a")

    def test_prepare_generated_image_adds_safe_margin_and_rgba(self):
        source = self.root / "source.png"
        image = Image.new("RGBA", (1024, 768), (0, 0, 0, 0))
        ImageDraw.Draw(image).rectangle((0, 100, 1023, 667), fill=(20, 80, 220, 255))
        image.save(source)
        output = self.root / "img/words/test/prepared.png"
        validator.prepare_generated_image(source, output)
        result = validator.inspect_image(output, generated=True)
        self.assertEqual(result["status"], "valid")
        self.assertEqual(result["mode"], "RGBA")
        self.assertGreaterEqual(min(result["safeMargins"]), 0.095)


if __name__ == "__main__":
    unittest.main(verbosity=2)

