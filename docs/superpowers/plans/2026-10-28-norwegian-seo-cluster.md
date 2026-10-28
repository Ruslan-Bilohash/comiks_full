# Norwegian learning SEO cluster — implementation plan

**Goal:** Publish useful, indexable landing pages for the main Norwegian-learning intents, localize them, connect them to the actual Komiks·Lab exercises, add internal navigation and include the canonical URLs in the generated sitemap.

**Research finding:** Current results are led by structured beginner courses (NTNU LearnNoW), game-like practice (Duolingo/Memrise), paid course funnels (Lingu) and focused vocabulary/testing tools. Komiks·Lab's strongest original value is the combination of voiced comics, word images, grammar, tests and QR games in one free product.

**Constraints:** No ranking guarantee, doorway pages, keyword stuffing or unsupported claims. Every page must have visible content matching its schema and a direct useful action.

## Task 1 — Specify the generated pages

- Add `tools/test-norwegian-seo-pages.cjs` before the generator.
- Require five distinct intents in eight interface languages: start/free course, tests, trainer, app, and a fair Duolingo comparison.
- Verify unique titles/descriptions/H1, canonical URLs, reciprocal hreflang with x-default, visible FAQ, valid JSON-LD, internal links, footer discovery and sitemap coverage.

## Task 2 — Generate the localized cluster

- Add `tools/build-norwegian-seo.js` with localized content and stable URL slugs.
- Give each intent a specific learning path, examples of real exercises and a CTA into the matching SPA route.
- Add `Course`, `LearningResource` or `SoftwareApplication` only where accurate, plus `BreadcrumbList` and visible `FAQPage` data.
- Clearly state that Komiks·Lab is independent from Duolingo.

## Task 3 — Integrate discovery

- Invoke the generator from `tools/build.js`.
- Append every canonical page and its localized alternates to `sitemap.xml`.
- Add a compact “Вивчення норвезької” link group to the main footer and localized generated footers.
- Add the cluster to `llms.txt` so search assistants can discover it.

## Task 4 — Verify and release safely

- Run the generator test in RED, implement to GREEN, then run SEO, sitemap and full build tests.
- Run a dry deploy.
- Compare the live version against the version observed immediately before deployment; abort if it changed.
- Deploy only the verified build and smoke-test the new production URLs, sitemap, privacy page and admin PHP health.

