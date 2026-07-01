# Live Proof WebGL Capture Reliability - 2026-07-01

Status: active

## Domain

- `n:render:three-scene`
- `n:render:terrain-bands`
- `n:goldrush:proof:live-state-audit`

## Problem

The local/public audit requires screenshots for every major state:

- title
- lobby
- loading yard
- gold field
- motion sample
- results

Playwright page screenshots are the normal proof path, but WebGL-heavy run-scene captures can stall on GPU readback. A failed screenshot must not silently remove run-scene visual proof, and a black canvas must not count as evidence.

## Source Notes

- Playwright documents `page.screenshot()` as the standard page capture path and `locator(...).screenshot()` as the element capture path.
- MDN documents `HTMLCanvasElement.toDataURL()` as a PNG data URL export path for canvas contents, but also warns that data URL export encodes the image into an in-memory string.
- MDN documents WebGL context attributes including `preserveDrawingBuffer`; when true, drawing buffers preserve values until cleared or overwritten by the author.

## Decision

Use a layered capture strategy:

1. Try Playwright page screenshot.
2. If page screenshot stalls, read active WebGL canvas pixels.
3. Reject canvas captures that are effectively black.
4. Fall back to element screenshot only after canvas readback fails.
5. Preserve WebGL drawing buffers only in `publicSmoke` proof mode.

## Why This Fits GoldRush

- The normal player build does not need preserved drawing buffers.
- The proof build needs stable visual evidence for local/public comparison.
- Canvas readback is scoped to the proof harness and recorded as a proof warning, not hidden.
- Blank-canvas rejection prevents false positive local/public proof.

## Accepted Evidence

Latest combined proof:

- Report: `reports/live-state-audit/local-public-live-audit-2026-07-01T02-33-16-207Z.json`
- Local run screenshot: `screenshots/live-state-audit/local/04-gold-field-2026-07-01T02-33-16-207Z.png`
- Public run screenshot: `screenshots/live-state-audit/public/04-gold-field-2026-07-01T02-33-16-207Z.png`

Result:

- local passed
- public passed
- comparison matched
- local run canvas captured at `1440x900`
- public run screenshot captured at `1440x900`

Latest screenshot-first single-target proofs:

- Browser doctor: `reports/browser-session-doctor/browser-session-doctor-2026-07-01T03-05-12-592Z.json`
- Local audit: `reports/live-state-audit/local-public-live-audit-2026-07-01T03-16-03-120Z.json`
- Public audit: `reports/live-state-audit/local-public-live-audit-2026-07-01T03-17-50-835Z.json`

Result:

- browser launch/context/page/screenshot/close lifecycle passed
- local screenshot-first audit passed with six screenshots and no video
- public screenshot-first audit passed with six screenshots and no video
- train boarding proof uses key-driven camera-relative movement
- timeout handles are cleared so successful proof commands exit cleanly

## Remaining Gap

The visual scene is still prototype-readable, not AAA-readable. The capture system is now reliable enough to judge the next visual passes without losing run-scene evidence.

## Proof Policy

- Default local/public comparison to screenshots.
- Record video only for motion bugs: pulsing, train timing, camera conflict, movement feel, or interaction timing.
- Close browser contexts explicitly so Playwright can finalize retained video only when video is enabled.
- Close the browser explicitly after each proof run.
- Run `proof:browser-doctor` first after a hung or suspicious Playwright session.
- Keep `recordVideo=false` as the default for broad state audits because screenshots are faster, easier to diff, and less likely to create large scratch artifacts.

## Sources

- https://playwright.dev/docs/screenshots
- https://playwright.dev/docs/api/class-browsercontext
- https://playwright.dev/docs/videos
- https://playwright.dev/docs/library
- https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toDataURL
- https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/getContext
