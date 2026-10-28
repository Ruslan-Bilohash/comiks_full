#!/usr/bin/env python3
"""Fill tools/.i18n jobs with offline Argos Translate models.

The output uses the same JSONL contract as tools/ai-translate.php, so the
existing i18n-fill.js merge step remains the single writer of TSV dictionaries.
Each completed batch is flushed immediately and reruns skip completed ids.
"""
from __future__ import annotations

import argparse
import json
import os
import re
import sys
import tempfile
from pathlib import Path

os.environ.setdefault("ARGOS_CHUNK_TYPE", "MINISBD")
runtime = Path(os.environ.get("KOMIKS_ARGOS_HOME", Path(tempfile.gettempdir()) / "komiks-argos-runtime"))
os.environ.setdefault("XDG_DATA_HOME", str(runtime / "data"))
os.environ.setdefault("XDG_CONFIG_HOME", str(runtime / "config"))
os.environ.setdefault("XDG_CACHE_HOME", str(runtime / "cache"))

from argostranslate import package, translate  # type: ignore  # noqa: E402

SUPPORTED = ("de", "pl", "tr", "lt", "ar")
PLACEHOLDER = re.compile(r"\{[a-zA-Z0-9_]+\}")


def installed_pair(target: str) -> bool:
    try:
        translate.get_translation_from_codes("en", target)
        return True
    except Exception:
        return False


def ensure_model(target: str) -> None:
    if installed_pair(target):
        return
    package.update_package_index()
    matches = [p for p in package.get_available_packages() if p.from_code == "en" and p.to_code == target]
    if not matches:
        raise RuntimeError(f"No Argos model en->{target}")
    chosen = matches[-1]
    print(f"Downloading Argos model en->{target} ({chosen.package_version})...", flush=True)
    package.install_from_path(chosen.download())


def load_done(path: Path) -> set[str]:
    done: set[str] = set()
    if not path.exists():
        return done
    for line in path.read_text(encoding="utf-8").splitlines():
        try:
            row = json.loads(line)
        except json.JSONDecodeError:
            continue
        if row.get("ok") and row.get("id"):
            done.add(str(row["id"]))
    return done


def translate_text(text: str, target: str) -> str:
    before = PLACEHOLDER.findall(text)
    value = translate.translate(text, "en", target).strip()
    after = PLACEHOLDER.findall(value)
    if before != after:
        raise RuntimeError(f"placeholder mismatch: {text!r} -> {value!r}")
    if not value:
        raise RuntimeError(f"empty translation: {text!r}")
    return value.replace("\t", " ").replace("\r", " ").replace("\n", " ")


def run_language(work: Path, lang: str) -> tuple[int, int]:
    jobs_path = work / f"jobs-{lang}.jsonl"
    out_path = work / f"out-argos-{lang}.jsonl"
    if not jobs_path.exists():
        raise FileNotFoundError(jobs_path)
    ensure_model(lang)
    done = load_done(out_path)
    jobs = [json.loads(line) for line in jobs_path.read_text(encoding="utf-8").splitlines() if line.strip()]
    pending = [job for job in jobs if str(job.get("id", "")) not in done]
    print(f"{lang}: {len(pending)} batches pending, {len(done)} already complete", flush=True)
    ok = bad = 0
    with out_path.open("a", encoding="utf-8", newline="\n") as handle:
        for index, job in enumerate(pending, 1):
            try:
                result = {str(item["k"]): translate_text(str(item["en"]), lang) for item in job["items"]}
                row = {"id": job["id"], "ok": True, "map": result, "engine": "argos"}
                ok += 1
                mark = "OK"
            except Exception as exc:  # keep the queue resumable and auditable
                row = {"id": job.get("id"), "ok": False, "why": str(exc), "engine": "argos"}
                bad += 1
                mark = "FAIL"
            handle.write(json.dumps(row, ensure_ascii=False) + "\n")
            handle.flush()
            print(f"{lang} [{index}/{len(pending)}] {job.get('id')} {mark}", flush=True)
    return ok, bad


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--work", type=Path, default=Path(__file__).resolve().parent / ".i18n")
    parser.add_argument("--models-only", action="store_true", help="download/install models without translating")
    parser.add_argument("languages", nargs="*", choices=SUPPORTED, default=list(SUPPORTED))
    args = parser.parse_args()
    languages = args.languages or list(SUPPORTED)
    if args.models_only:
        for lang in languages:
            ensure_model(lang)
        print("models ready: " + ", ".join(languages), flush=True)
        return 0
    total_ok = total_bad = 0
    for lang in languages:
        ok, bad = run_language(args.work, lang)
        total_ok += ok
        total_bad += bad
    print(f"complete: {total_ok} batches, {total_bad} failed", flush=True)
    return 1 if total_bad else 0


if __name__ == "__main__":
    sys.exit(main())
