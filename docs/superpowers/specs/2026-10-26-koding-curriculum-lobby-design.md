# Koding curriculum and responsive lobby design

## Scope

Extend `#/koding` into a compact learning hub and make `#/game/lobby` usable from 320 px phones through classroom projectors and 4K displays. Preserve the current routes, progress keys, quiz answers, comic renderer, and visual identity.

## Lobby

- Keep the existing two-column desktop idea, but give it three deliberate zones: room identity, settings/players, and the primary Start action.
- On wide screens, the QR card is a bounded presentation panel and the right side uses the remaining width without stretching controls.
- On short laptop screens, the page remains one viewport while the player list becomes the scrollable region.
- On tablets and phones, the layout becomes one column, the QR and room code stay readable, controls use the full width, and page scrolling is restored where necessary.
- Use fluid sizes and breakpoint rules for 320×568, 768×1024, 1366×768, 1920×1080 and ultra-wide viewports.

## Koding hub

The page becomes a category hub with six learning worlds:

1. Foundations — current p183–p190.
2. Web — p191 plus CSS and JavaScript.
3. Game development — scene/player, input/movement, collision/score/levels.
4. Blender — viewport/basic shapes and modelling/material/light.
5. Unity — GameObjects/components and scenes/prefabs.
6. Databases — tables/records, search/SQL, privacy/safe data.

Each category card shows its icon, short goal, completed count and progress bar. Selecting a category reveals its compact journey scale and one focused lesson card. The existing global rank and badges remain. The current nine-step journey becomes data-driven and must not hard-code its column count.

## New comics

Add p192–p203. Each comic contains six illustrated panels, Norwegian dialogue with Ukrainian and English translations, at least three graded tasks, and a vocabulary list. The new panels use the existing vector comic engine with additional reusable props for browser styling, a 2D game scene, Blender-like 3D viewport, Unity-like editor, and database tables. This keeps every image responsive, crisp and visually consistent with Komiks·Lab.

## Safety and compatibility

- Do not alter authentication, payments, user data or saved progress formats.
- Existing comic IDs and routes remain unchanged.
- New `track` metadata is optional; old data continues to work.
- Production deployment remains a separate approval step.

## Verification

- Unit tests for curriculum grouping, progress and 12-comic completeness.
- Browser assertions for category navigation and resumed lesson visibility.
- Browser viewport matrix for lobby overflow and control visibility.
- Existing data checks, logic tests, WebRTC regression, build and deploy dry-run.
