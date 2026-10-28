#!/usr/bin/env python3
"""Translate remaining i18n jobs through MyMemory's public API.

This is a narrow fallback for strings an offline model returns unchanged. The
output follows the JSONL contract consumed by tools/i18n-fill.js.
"""
from __future__ import annotations

import argparse
import html
import json
import re
import sys
import time
import urllib.parse
import urllib.request
from pathlib import Path


PROTECTED = re.compile(r"\{[a-zA-Z0-9_]+\}|&(?:#\d+|#x[0-9A-Fa-f]+|[A-Za-z]+);|<[^>]+>")


def translate_text(text: str, target: str) -> str:
    values: list[str] = []

    def protect(match: re.Match[str]) -> str:
        values.append(match.group(0))
        return f"__PH_{len(values) - 1}__"

    protected = PROTECTED.sub(protect, text)
    query = urllib.parse.urlencode({"q": protected, "langpair": f"en|{target}"})
    request = urllib.request.Request(
        f"https://api.mymemory.translated.net/get?{query}",
        headers={"User-Agent": "Komiks-Lab-i18n/1.0"},
    )
    with urllib.request.urlopen(request, timeout=30) as response:
        payload = json.load(response)
    if int(payload.get("responseStatus", 0)) != 200:
        raise RuntimeError(str(payload.get("responseDetails") or payload))
    translated = html.unescape(str(payload["responseData"]["translatedText"])).strip()
    for index, original in enumerate(values):
        token = f"__PH_{index}__"
        if token not in translated:
            raise RuntimeError(f"protected token lost: {token} in {text!r}")
        translated = translated.replace(token, original)
    if not translated:
        raise RuntimeError(f"empty translation: {text!r}")
    return translated.replace("\t", " ").replace("\r", " ").replace("\n", " ")


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("language", choices=("ar", "de", "pl", "tr", "lt"))
    parser.add_argument("--work", type=Path, default=Path(__file__).resolve().parent / ".i18n")
    args = parser.parse_args()
    jobs_path = args.work / f"jobs-{args.language}.jsonl"
    out_path = args.work / f"out-mymemory-{args.language}.jsonl"
    jobs = [json.loads(line) for line in jobs_path.read_text(encoding="utf-8").splitlines() if line.strip()]
    failures = 0
    with out_path.open("w", encoding="utf-8", newline="\n") as handle:
        for position, job in enumerate(jobs, 1):
            try:
                result = {}
                for item in job["items"]:
                    result[str(item["k"])] = translate_text(str(item["en"]), args.language)
                    time.sleep(0.15)
                row = {"id": job["id"], "ok": True, "map": result, "engine": "mymemory"}
                state = "OK"
            except Exception as exc:
                row = {"id": job.get("id"), "ok": False, "why": str(exc), "engine": "mymemory"}
                failures += 1
                state = "FAIL"
            handle.write(json.dumps(row, ensure_ascii=False) + "\n")
            handle.flush()
            print(f"{args.language} [{position}/{len(jobs)}] {job.get('id')} {state}", flush=True)
    print(f"complete: {len(jobs) - failures} batches, {failures} failed", flush=True)
    return 1 if failures else 0


if __name__ == "__main__":
    sys.exit(main())
