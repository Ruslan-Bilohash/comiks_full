# Koding curriculum and responsive lobby implementation plan

## Task 1: Protect the shared checkout

- Save a file-level checkpoint outside the repository.
- Record HEAD, dirty status and checksums.
- Never reset or overwrite unrelated work.

## Task 2: Responsive lobby

- Add a failing browser layout test for phone, tablet, short laptop and desktop.
- Add semantic lobby subcontainers without changing room logic.
- Implement fluid desktop, short-height and mobile CSS.
- Run the layout test and the existing WebRTC regression.

## Task 3: Curriculum model and category UI

- Add failing unit tests for the six category groups and their expected counts.
- Add track definitions and category grouping helpers.
- Refactor the compact journey to accept a category and dynamic step count.
- Add category cards, category progress and translated descriptions.
- Extend browser tests for category selection and keyboard/mobile behavior.

## Task 4: Illustration primitives

- Add reusable SVG props for web styling, 2D game scenes, Blender, Unity and database concepts.
- Add a smoke test that renders every new prop and rejects broken markup.

## Task 5: Twelve comics

- Add p192–p203 with six panels, translations, tasks and vocabulary.
- Register all files in `data/index.js` in learning order.
- Validate IDs, category, track, panel/task/vocabulary counts and routes.

## Task 6: Full verification

- Run syntax checks, focused unit/browser tests, content check and logic tests.
- Build `dist`, rerun browser tests against it, and run deploy dry-run.
- Inspect representative phone, laptop and desktop screenshots.
- Report the reviewable local result and request deployment approval separately.
