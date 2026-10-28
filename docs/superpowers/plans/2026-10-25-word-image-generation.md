# Komiks·Lab Word Image Generation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Audit every word used by vocabulary and quiz routes, preserve valid existing art, generate every required missing 512×512 transparent PNG, connect it through the current `KomiksPics` pipeline, validate it, and package category and full ZIP exports.

**Architecture:** Execute `data/words.js` through `data/words4.js`, `assets/pics*.js`, `data/words-tools.js`, and `data/word-photos.js` in a sandboxed Node context matching browser load order. Treat valid inline SVG and raster art as existing images. Put new PNG files under `img/words/<theme>/`, expose them through a generated mapping that calls the existing `KomiksPics.addPhotos`, and keep a resumable JSON queue with an immutable prompt per word.

**Tech Stack:** Browser JavaScript data files, Node.js audit/package scripts, Python Pillow for pixel validation and PNG normalization, built-in ImageGen for one generated asset per prompt.

**Spec:** User request from 2026-10-25 in this chat.

## Global Constraints

- Do not modify authentication, user data, learning progress, billing, answers, or quiz rules.
- Do not delete or overwrite valid existing images.
- New generated assets are PNG, 512×512, RGBA, genuinely transparent, one centered subject, at least 10% safe margin, no text or watermark.
- Preserve existing `KomiksPics` lookup behavior and existing image paths.
- Do not deploy to production without explicit confirmation.
- Generation is resumable and proceeds in batches of 20–50; each failed asset retries independently.

## Review Focus

- Duplicate Norwegian words with different meanings must resolve by theme/translation, not overwrite each other.
- A valid existing inline SVG or raster must not be queued for generation.
- Corrupt, opaque, empty, clipped, or wrongly sized generated PNG files must fail validation.
- Normalized filenames must remain stable and collision-free across reruns.
- Vocabulary cards, picture questions, matching, and picture-choice tests must all resolve the same image.

---

### Task 1: Reproducible repository and vocabulary audit

**Files:**
- Create: `tools/test-word-image-audit.cjs`
- Create: `tools/audit-word-images.cjs`
- Create: `tools/validate-word-images.py`
- Create: `reports/image-audit.json`
- Create: `reports/image-source-state.json`

**Interfaces:**
- Produces `reports/image-audit.json` entries with `id`, `category`, `norwegian`, `ukrainian`, `english`, `image`, `sourceType`, `status`, `needsGeneration`, `prompt`, and `filename`.

- [ ] Write failing fixture tests for full load order, article normalization, translation-specific images, filename collisions, existing SVG/raster detection, and broken paths.
- [ ] Run the test and confirm failure because the audit module does not exist.
- [ ] Implement the sandbox loader, stable IDs/slugs, source map, and JSON writer.
- [ ] Implement Pillow validation for format, decode, dimensions, alpha, content bounds, and duplicate pixel hashes.
- [ ] Run the tests and generate the full audit.

### Task 2: Resumable generation manifest and integration mapping

**Files:**
- Create: `tools/test-word-image-queue.cjs`
- Create: `tools/build-word-image-queue.cjs`
- Create: `reports/image-generation-queue.json`
- Create: `data/word-images-generated.js`
- Modify: `data/index.js`

**Interfaces:**
- Consumes `reports/image-audit.json`.
- Produces a stable pending/generated/failed queue and a `KomiksPics.addPhotos` mapping using existing lookup semantics.

- [ ] Write failing tests for deterministic prompts, stable collision-safe filenames, resume behavior, and translation-specific duplicates.
- [ ] Implement queue and mapping generation.
- [ ] Add `data/word-images-generated.js` immediately after `data/word-photos.js` in the shared data load order.
- [ ] Re-run tests and prove a second run makes no duplicate queue entries.

### Task 3: Generate and validate all missing assets

**Files:**
- Create: `img/words/<theme>/<stable-name>.png`
- Update: `reports/image-generation-queue.json`
- Update: `reports/image-audit.json`

**Interfaces:**
- One built-in ImageGen call per missing word, using the stored prompt and transparent background.
- Each accepted output passes Pillow validation before its queue state changes to `generated`.

- [ ] Generate batches of 20–50 in queue order.
- [ ] Copy each output from the ImageGen result into its final project path without overwriting existing files.
- [ ] Normalize to exactly 512×512 RGBA while preserving alpha and safe margins.
- [ ] Validate each file; retry only failed items with a targeted prompt correction.
- [ ] Regenerate the mapping and audit after every batch.
- [ ] Continue until no required entry remains pending, or record the exact generator failure and leave a resumable queue.

### Task 4: Application and quiz verification

**Files:**
- Create: `tools/test-word-images-browser.cjs`
- Modify only if a verified defect is found: `assets/words.js`, `assets/pairs.js`, `assets/game.js`

**Interfaces:**
- Verifies `#/words`, `#/quiz/words`, match, picture-choice, pairs, and QR-room image resolution without altering answers.

- [ ] Assert that every mapped file loads and every picture question's correct answer matches its source word.
- [ ] Run desktop and mobile viewport checks across every theme.
- [ ] Confirm audio and translations remain unchanged.
- [ ] Fix only demonstrated integration defects and rerun the complete tests.

### Task 5: Exports and final report

**Files:**
- Create: `tools/export-word-images.cjs`
- Create: `exports/<theme>.zip`
- Create: `exports/Komiks_LAB_ALL_IMAGES_512.zip`
- Create: `reports/image-generation-report.md`

**Interfaces:**
- Each category ZIP contains PNG files, `prompts.txt`, and `manifest.json`.
- The all-images ZIP contains every successfully generated and validated 512×512 PNG.

- [ ] Build deterministic category ZIPs and the combined archive.
- [ ] Verify archive manifests against file hashes and the final audit.
- [ ] Run all audit, queue, browser, and available project tests.
- [ ] Record exact totals, failures, unresolved words, and test evidence in the final report.

