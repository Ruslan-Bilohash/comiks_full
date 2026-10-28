# Compact Koding Journey Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the tall nine-row `Min kodereise` timeline with a compact progress scale, one focused lesson card, and an expandable all-steps list.

**Architecture:** Keep progress data and URLs in `assets/koding.js`. Add a pure `journeyModel(items)` helper that derives step states, completion count, initial selection, and the all-complete state; use it to render the scale and focused card. Limit visual work to the existing Koding CSS section.

**Tech Stack:** Browser JavaScript, existing `KomiksCore.h` DOM helper, CSS, Node.js `node:test` and `vm`.

**Spec:** `docs/superpowers/specs/2026-10-25-koding-journey-design.md`

## Global Constraints

- Preserve current progress keys, rank calculation, comic data, quiz results, and routes.
- Preserve the Komiks·LAB visual language and translations in Norwegian, Ukrainian, and English.
- Do not change Robo game logic, test answers, server data, or authentication.
- Support keyboard focus, 44 px interactive targets, horizontal mobile scrolling, and `prefers-reduced-motion`.

## Review Focus

- No completed lessons: step 1 is selected and progress is `0/9`.
- A read-only or test-only lesson is `started`, not complete.
- Completed lessons require both reading and at least one test star.
- All lessons completed: the final step is selected and the mixed-test completion action appears.
- Existing `#/read/<id>/0` and `#/quiz/<id>` links remain unchanged.

---

### Task 1: Journey state model

**Files:**
- Create: `tools/test-koding-journey.cjs`
- Modify: `assets/koding.js:399-447`

**Interfaces:**
- Produces: `journeyModel(items: Array<{id, read, stars}>): {steps, done, total, activeIndex, complete}` exposed as `window.KomiksKoding.journeyModel`.

- [ ] Write failing Node tests for empty progress, partial progress, read-only/test-only progress, and all-complete progress.
- [ ] Run `node --test tools/test-koding-journey.cjs`; confirm failure because `journeyModel` is missing.
- [ ] Implement the pure helper and wire `hubState()` data into it.
- [ ] Run the focused test; confirm all model cases pass.

### Task 2: Compact journey component

**Files:**
- Modify: `assets/koding.js:387-447`
- Modify: `assets/style.css:5077-5095`
- Test: `tools/test-koding-journey.cjs`

**Interfaces:**
- Consumes: `journeyModel(items)` from Task 1.
- Produces: progress summary, `role="progressbar"`, nine clickable nodes, focused lesson card, and collapsed `details` list.

- [ ] Add failing source-contract assertions for the progress bar, node controls, focused card, and expandable list.
- [ ] Run the focused test; confirm the missing compact markup fails.
- [ ] Add localized labels and render the compact block with existing links and progress state.
- [ ] Replace the old vertical timeline CSS with desktop and mobile compact styles, visible focus, and reduced-motion handling.
- [ ] Run the focused tests; confirm all pass.

### Task 3: Browser and project verification

**Files:**
- Create: `tools/test-koding-journey-browser.cjs`
- Modify only if a verified defect is found: `assets/koding.js`, `assets/style.css`

**Interfaces:**
- Consumes: built local site.
- Produces: browser assertions for initial selection, node switching, details expansion, routes, mobile overflow, and zero runtime errors.

- [ ] Write the browser check and run it against the pre-change page to confirm it fails on the compact-layout assertions.
- [ ] Build with `node tools/build.js` and run the browser check at desktop and mobile widths.
- [ ] Run `node --check assets/koding.js`, `node --test tools/test-koding-journey.cjs`, `node tools/check.js`, and available project tests.
- [ ] Inspect the final diff only for `assets/koding.js`, `assets/style.css`, tests, spec, plan, and generated build files.
- [ ] Prepare the verified build for deployment; do not publish the new change until production authorization is confirmed.
