# Safety and Secure Coding Comics Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add twenty complete safety and secure-programming comics, grouped into five curriculum categories with quizzes and localized SEO pages.

**Architecture:** A single data-driven comic source appends `p204`–`p223` to `window.COMICS`. Existing readers and quiz builders consume the standard comic shape; `assets/koding.js` and `tools/build-koding-seo.js` receive matching track metadata.

**Tech Stack:** JavaScript data files, existing SVG art renderer, Node test runner, static SEO build.

**Spec:** `docs/superpowers/specs/2026-10-26-safety-coding-comics-design.md`

## Global Constraints

- Exactly 20 new comics, IDs `p204`–`p223`.
- Exactly five new categories with four comics each.
- Every comic has 6 panels, 3+ tasks and 12+ vocabulary items in Norwegian, Ukrainian and English.
- Defensive, age-appropriate safety guidance only.
- Existing user progress and routes remain compatible.

## Review Focus

- Each category must contain the intended four unique IDs.
- No task may teach bypassing CAPTCHA, phishing, fraud, or account theft.
- Every panel and task must contain all three languages.
- Category metadata must match between runtime and SEO output.
- Built sitemap and comic registry must include every new lesson.

---

### Task 1: Curriculum contract

**Files:**
- Modify: `tools/test-koding-curriculum.cjs`

- [ ] Add failing assertions for the five tracks and twenty lesson objects.
- [ ] Run the test and confirm it fails because `p204` is absent.

### Task 2: Comic data

**Files:**
- Create: `data/comic-204-223-safety.js`

- [ ] Implement the standard comic objects with panels, translations, tasks and vocabulary.
- [ ] Register the source through the normal build registry.
- [ ] Run curriculum and illustration tests until green.

### Task 3: Curriculum categories

**Files:**
- Modify: `assets/koding.js`

- [ ] Add localized track cards for all five safety categories.
- [ ] Add safety badges tied to representative lessons.
- [ ] Run the curriculum and journey browser tests.

### Task 4: SEO categories

**Files:**
- Modify: `tools/build-koding-seo.js`
- Modify: `tools/test-koding-seo.cjs`

- [ ] Add matching localized category pages and keywords.
- [ ] Verify structured data, lesson links and sitemap entries.

### Task 5: Release

**Files:**
- Generated: `data/index.js`, `sitemap.xml`, `dist/**`

- [ ] Run syntax, curriculum, SEO and build tests.
- [ ] Inspect generated registry and category counts.
- [ ] Dry-run deployment, deploy, and verify live version plus API health.

