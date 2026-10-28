# Safety and Secure Coding Comics — Design

## Intent

Add twenty child-friendly comic lessons to Komiks·Lab so children can practise personal safety, recognise online manipulation, protect devices and data, and understand how programmers build safer systems.

## Content

The lessons continue the coding sequence as `p204`–`p223`. Every lesson has six illustrated panels, Norwegian dialogue with Ukrainian and English translations, at least three comprehension questions, and at least twelve vocabulary items.

Five new curriculum categories contain four lessons each:

- `personal-safety`: trusted adults, strangers, getting lost, and calling 112.
- `cyber-safety`: passwords and 2FA, phishing, QR links, and sharing photos.
- `scam-awareness`: fake prizes, cloned voices, marketplace fraud, and impersonation.
- `device-safety`: app permissions, updates, public Wi-Fi, and backups.
- `secure-coding`: CAPTCHA, input validation, HTTPS, and password hashing.

The stories teach defensive actions. They do not describe ways to commit crimes, bypass security, defeat CAPTCHA, steal accounts, or exploit software. Children are told to create distance, use known contact channels, involve a trusted adult, report and block suspicious contact, and call emergency services only for real emergencies.

## Architecture

The chosen approach is one data-driven comic file following `comic-192-203-koding-worlds.js`. This keeps the existing comic reader, artwork renderer, translations, quizzes, progress tracking and SEO pipeline unchanged.

Alternative approaches considered:

- One file per comic: easiest to inspect individually, but repeats helpers and creates twenty large files.
- A new JSON/generator format: compact, but introduces a second content system and build step.

The curriculum gains five track definitions. Static SEO pages use the same categories and create localized category pages in Norwegian, Ukrainian and English. The sitemap receives those pages through the existing coding SEO builder.

## Constraints

- Preserve existing progress, routes, answers and comic IDs.
- Use only existing illustration primitives from `assets/art.js`.
- Keep language at a child-friendly A1–B1 level.
- Do not include operational offensive-security instructions.
- Build and deploy only after source and built-output tests pass.

