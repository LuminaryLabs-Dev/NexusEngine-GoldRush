# Local/Public Live State Audit - 2026-07-01

## Intention

Audit the current `NexusEngine-GoldRush` player-facing state as two separate targets:

- local development build: current `development` checkout served through Vite.
- public deployment: GitHub Pages Build branch at `https://luminarylabs-dev.github.io/NexusEngine-GoldRush/`.

The goal is to keep screenshots, videos, simulator checks, and host-state proof together so future fixes can compare visible game feel against runtime truth.

## Evidence

| Target | Proof | Result |
|---|---|---|
| combined local/public proof | `reports/live-state-audit/local-public-live-audit-2026-07-01T02-33-16-207Z.json` | passed and matched; retained six screenshots per target plus videos |
| browser session doctor | `reports/browser-session-doctor/browser-session-doctor-2026-07-01T03-05-12-592Z.json` | passed launch/context/page/screenshot/close lifecycle with `recordVideo=false` and clean browser disconnect after close |
| fresh local screenshot-first proof | `reports/live-state-audit/local-public-live-audit-2026-07-01T03-16-03-120Z.json` | passed title -> lobby -> loading-yard -> gold-field -> motion sample -> results with six screenshots and no video |
| fresh public screenshot-first proof | `reports/live-state-audit/local-public-live-audit-2026-07-01T03-17-50-835Z.json` | passed title -> lobby -> loading-yard -> gold-field -> motion sample -> results with six screenshots and no video |
| proof-runner hard-timeout probe | `reports/live-state-audit/local-public-live-audit-2026-07-01T02-55-34-927Z.json` | intentionally failed with `--hardTimeout 1000`; proved hung browser runs still write sanitized JSON/Markdown and exit |
| attempted fresh browser proof | `screenshots/live-state-audit/local/04-gold-field-2026-07-01T02-43-49-775Z.png` | partial local screenshot captured; later Playwright/Chrome control hung before a complete fresh report |
| local live video | `output/live-test-it/local-audit/2026-07-01T00-27-14-066Z/report.json` | passed flow to `site.gold-field`; video captured |
| public live video | `output/live-test-it/public-audit/2026-07-01T00-27-14-066Z/report.json` | passed flow to `site.gold-field`; video captured |
| local strict smoke | `reports/local-smoke-audit/public-smoke-2026-07-01T00-31-21-093Z.json` | passed title -> lobby -> natural train boarding -> run -> results |
| public strict smoke | `reports/public-smoke-audit/public-smoke-2026-07-01T00-29-38-530Z.json` | passed title -> lobby -> natural train boarding -> run -> results |
| local simulator | `.nexus-simulator/scenarios/goldrush-local/goldrush-smoke.jsonl` | passed 22 NexusSimulator checks |
| local camera/ground stability | `output/playwright/camera-ground-stability-proof/camera-ground-stability-2026-07-01T00-43-33-050Z.json` | passed 160-frame run probe |

Screenshots:

- local latest title: `screenshots/live-state-audit/local/01-title-2026-07-01T03-16-03-120Z.png`
- local latest lobby: `screenshots/live-state-audit/local/02-lobby-2026-07-01T03-16-03-120Z.png`
- local latest loading yard: `screenshots/live-state-audit/local/03-loading-yard-2026-07-01T03-16-03-120Z.png`
- local latest gold field: `screenshots/live-state-audit/local/04-gold-field-2026-07-01T03-16-03-120Z.png`
- local latest motion sample: `screenshots/live-state-audit/local/05-motion-sampled-2026-07-01T03-16-03-120Z.png`
- local latest results: `screenshots/live-state-audit/local/06-results-2026-07-01T03-16-03-120Z.png`
- public latest title: `screenshots/live-state-audit/public/01-title-2026-07-01T03-17-50-835Z.png`
- public latest lobby: `screenshots/live-state-audit/public/02-lobby-2026-07-01T03-17-50-835Z.png`
- public latest loading yard: `screenshots/live-state-audit/public/03-loading-yard-2026-07-01T03-17-50-835Z.png`
- public latest gold field: `screenshots/live-state-audit/public/04-gold-field-2026-07-01T03-17-50-835Z.png`
- public latest motion sample: `screenshots/live-state-audit/public/05-motion-sampled-2026-07-01T03-17-50-835Z.png`
- public latest results: `screenshots/live-state-audit/public/06-results-2026-07-01T03-17-50-835Z.png`
- local video final: `output/live-test-it/local-audit/2026-07-01T00-27-14-066Z/final.png`
- public video final: `output/live-test-it/public-audit/2026-07-01T00-27-14-066Z/final.png`
- local strict gold field: `screenshots/local-smoke-audit/04-gold-field-2026-07-01T00-31-21-093Z.png`
- local strict results: `screenshots/local-smoke-audit/05-results-2026-07-01T00-31-21-093Z.png`
- public strict gold field: `screenshots/public-smoke-audit/04-gold-field-2026-07-01T00-29-38-530Z.png`
- public strict results: `screenshots/public-smoke-audit/05-results-2026-07-01T00-29-38-530Z.png`

Videos:

- local latest: `output/live-state-audit-videos/local-2026-07-01T02-33-16-207Z/page@c7b929a21ca4807f154e02d8377b02e0.webm`
- public latest: `output/live-state-audit-videos/public-2026-07-01T02-33-16-207Z/page@bc3fb790d94a682ad63d0980ba40162f.webm`
- local: `output/live-test-it/local-audit/2026-07-01T00-27-14-066Z/video/page@48a3f45dd6fd58da2a86626c3eebacd6.webm`
- public: `output/live-test-it/public-audit/2026-07-01T00-27-14-066Z/video/page@99076c55267574bbc3203ad4fbe34275.webm`

## Current State

Local and public are behaviorally aligned for the audited path.

- Both start at `site.start`.
- Both enter `site.lobby-character`.
- Both enter `site.loading-yard`.
- Both expose train readout `goldrush-train-sequence-readout-v1`.
- Both walk naturally from loading-yard spawn to the train.
- Both lock the player to the train and hand off to `site.gold-field`.
- Both launch a 20-player match.
- Both expose `camera-relative-wasd`.
- Both expose terrain placement as `downward-triangle-raycast`.
- Both expose terrain physics as `cannon-es` `Heightfield`.
- Both complete to `site.results`.
- Both pass `realityValidation`.
- The latest proof harness captures non-black run-scene evidence on both targets. Local WebGL-heavy pages may use `webgl-canvas-data-url` fallback; that fallback now rejects blank canvas captures and only preserves the drawing buffer in `publicSmoke` proof mode.
- `proof:live-state-audit` now supports `--recordVideo=false` for screenshot-first local/public audits and `--hardTimeout <ms>` so unhealthy Playwright/Chrome sessions produce a failed sanitized report instead of no artifact.
- `proof:browser-doctor` is the first check when Playwright/Chrome seems unhealthy. It validates browser launch, isolated context creation, page creation, screenshot capture, context close, and browser close before running a long game proof.
- Fresh local and public single-target proofs passed after the proof runner switched back to player-input-driven train boarding and separate boarding/sample timeouts.

## Findings

1. Visuals are stable but still prototype-readable, not production-readable.
   - The blue void/inside-out terrain failure is not present in current proof.
   - The scene now reads as a broad low-poly canyon field with landmarks.
   - The gold seam and micro-object cluster on the right is too noisy and competes with the player silhouette.
   - Hardening: add a visual hierarchy pass for resource objects, nearby affordances, far clutter, and landmark silhouettes.

2. Local and public proof are in sync, and the new camera/ground stability harness now covers the pulsing diagnosis gap locally.
   - The live video reports only reach `frameCount` 2 after run handoff.
   - `npm run proof:camera-ground-stability` now samples 160 run frames after natural train boarding.
   - Latest proof: 0 ground mismatch, 0 render-ground mismatch, 0 large camera jumps, 0 unstable frames, 0 camera perspective reselections.
   - Remaining hardening: run the same harness against public after deploy changes and extend it to retain video when diagnosing player-reported pulsing.

3. Browser proof health is now a separate audit surface from game health.
   - A fresh combined run on this machine hung during Playwright/Chrome control after writing partial screenshots.
   - A local-only camera proof also hung before returning a report.
   - A deliberately short hard-timeout probe proved the live-audit runner now writes a sanitized failure report and exits.
   - The browser-session doctor now passes and closes cleanly.
   - Hardening: keep screenshots mandatory, use `--recordVideo=false` for broad local/public comparison, reserve video for motion bugs, and run the lightweight browser-session doctor before long proof loops when Playwright control has recently been unstable.

4. The live-state proof harness had two runner-level reliability bugs that are now resolved.
   - Synthetic `GameHost.tick()` boarding could report success at `handoff-ready` before the browser consumed the handoff into `screen: run`.
   - Timeout helper timers were not cleared, so a passing browser doctor could leave Node alive after printing its report.
   - The harness now uses key-driven camera-relative boarding, separate `--boardingTimeout` and `--sampleTimeout`, and clears timeout handles.

5. The strict smoke proof validates natural train boarding, but the general live-test helper still uses a placement helper.
   - The live-test videos used `publicSmokePlaceAtTrainDoor`.
   - The strict local/public smoke proofs use natural camera-relative walking and passed.
   - Hardening: update the live-test loop flow to share the strict natural-walk boarding path so video evidence and deploy proof use the same player path.

6. Results screen is functionally clear, but gameplay loop proof is still too compressed.
   - Results show score, gold, contest, awards, replay moments, and actions.
   - The smoke proof completes extraction through a helper action after run entry.
   - Hardening: add a longer human-view proof path for mine -> carry -> walk to cashout -> hold extract -> results without direct completion helper.

7. Combat pressure is represented in results but not yet felt as a playable encounter.
   - Results show lockdown and claim-jumper pressure.
   - The audited visible run state does not show a readable combat exchange, ammo cadence, cover choice, or hit confirmation.
   - Hardening: next gameplay pass should make ambush pressure player-action driven, with readable threat direction, cover, fire/reload feedback, and receipt-backed results.

8. Terrain and physics contracts are healthy for this path, but physical contact is still not deeply proven.
   - Runtime exposes `cannon-es`, `Heightfield`, and visible-band raycast placement.
   - The player position equals sampled ground height in proof.
   - Hardening: add slope/edge/collision clips for walking across hills, blocked mountain faces, rail/depot props, and gold seam clutter.

## Local/Public Delta

No meaningful player-facing delta was found in this audit.

Differences observed:

- local Vite emits expected dev-server debug messages.
- both local and public emit WebGL `ReadPixels` performance warnings during screenshot capture.
- strict smoke positions differ slightly at train boarding because natural movement timing differs, but both end with `playerLockedToTrain: true`.

## Next Test Loop

Run this every time visuals/camera/movement change:

```txt
1. npm run proof:public -- --url http://127.0.0.1:5173/NexusEngine-GoldRush/ --out reports/local-smoke-audit --screenshots screenshots/local-smoke-audit
2. npm run proof:public -- --url https://luminarylabs-dev.github.io/NexusEngine-GoldRush/ --out reports/public-smoke-audit --screenshots screenshots/public-smoke-audit
3. npm run proof:live-state-audit -- --target both --recordVideo=false --localUrl http://127.0.0.1:5173/NexusEngine-GoldRush/ --hardTimeout 180000
4. node ~/.codex/skills/live-test-it/scripts/live_test_loop.mjs --url <target-url> --flow goldrush-first-sequence --out output/live-test-it/<target>-audit --width 1440 --height 900
5. npm run proof:camera-ground-stability
6. npm run sim:test
```

Needed improvement:

```txt
live-test-it long-run camera probe follow-up
├─ reuse camera-ground-stability sampling
├─ add optional video recording
├─ run against public URL after deploy
└─ write a small diagnosis: stable, camera-pulsing, player-ground-pulsing, or terrain-flicker
```
