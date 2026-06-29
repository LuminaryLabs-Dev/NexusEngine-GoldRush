# Live Playtest Loop

Status: active

## Purpose

Use the player as the strongest validation signal. Codex launches or verifies the live debug build, asks the user to play, then changes exactly one user-reported issue before repeating.

## Loop

1. Codex verifies or launches the local debug URL.
2. Codex gives the user the exact URL and the smallest needed controls.
3. User plays the current build.
4. User reports exactly one thing to change.
5. Codex implements that one change only.
6. Codex runs validation.
7. Codex captures a Playwright screenshot.
8. Codex updates this packet and the ME goal ledger.
9. Repeat.

## Current Debug URL

```txt
http://localhost:5177/NexusEngine-GoldRush/
```

If `5177` is occupied, use the next Vite port shown in terminal, for example `http://localhost:5178/NexusEngine-GoldRush/`.

## Current Controls

- Start: `Play`
- Lobby: drag the 3D skeleton prospector to rotate it; use the `Group Type` dropdown for `Crew`, `Posse`, or `Outfit`; optionally press `Create Code` and share the party code; followers enter the code and press `Join Party`; the leader presses `Start`
- Loading yard: use `WASD` to walk to the train; reaching the train starts departure and hands off to the gold field
- In game:
  - `WASD`: walk relative to camera direction
  - hold `E` near a gold seam: mine gold
  - hold `E` near extraction: cash out and create receipt
  - right mouse: closer aim/combat posture
  - left mouse: fire at active local threat pressure
  - `M`, `C`, `F`: legacy debug shortcuts for mine, cashout, and ambush
  - `Escape`: return to lobby

## One-Change Rule

The next user message after a playtest should be one specific change, for example:

```txt
make the mine entrance bigger
```

Avoid batching five changes in one playtest turn. The goal is fast visible correction.

## Current Proof

- Debug server verified live on port `5177`.
- `curl -I http://localhost:5177/NexusEngine-GoldRush/` returned `200 OK`.
- Latest validation before this loop: `npm run check` passed after adding scene sites, the draggable Three.js lobby character, and the loading-yard train site.
- One-change receipts are tracked in `.agent/active/playtest-change-receipts.md`.
- `npm run playtest:doctor` verifies the live URL, default 72-player runtime contract, four-player PeerJS party cap, 20-player leader launch configuration, and `lobby -> loading -> run` scene-site flow before asking for human feedback.
- Latest lobby screenshot proof: `.playwright-cli/page-2026-06-29T08-52-31-485Z.png`.
- Latest launch screenshot proof: `.playwright-cli/page-2026-06-29T08-49-41-599Z.png`.
- Latest 3D lobby character proof: `.playwright-cli/page-2026-06-29T10-27-14-089Z.png`.
- Latest loading-yard proof: `.playwright-cli/page-2026-06-29T10-27-30-857Z.png`.
- Latest train-to-gold-field proof: `.playwright-cli/page-2026-06-29T10-28-34-680Z.png`.
- Latest terrain/movement proof: `.playwright-cli/page-2026-06-29T11-02-18-085Z.png`; Playwright verified mouse-look yaw `-0.676`, W movement from `(-12, -20)` to about `(-17.23, -13.48)`, downward raycast ground on `near-play-band`, and `cannon-es` heightfield physics in debug state.
- Latest network proof: `npm run check` and `npm run playtest:doctor` passed after adding the incremental room session allocator; validators prove player 51 creates partition 2, duplicate joins reject, player 101 rejects, leave compacts active players into partition 1, and partition 2 remains retained below 51 players.
- Latest reality-status proof: `npm run check`, `npm run playtest:doctor`, and Playwright browser proof passed after adding `engine.n.goldrushReality`; browser screenshot `.playwright-cli/page-2026-06-29T11-37-54-591Z.png` shows the live app and `window.GoldRushHost.getState().realityStatus.summary` reported 14 domains, 44 placeholder slots, 0 promoted assets, and 0 promoted audio. The validator marks legacy assets and actual audio/music as cloud-blocked, character rig/animation/combat/mining/train polish as prototype, and network/PeerJS/scene-loader/terrain/runtime-kit domains as real-local when their receipts are present.
- Latest GPT-it attempt: isolated runner wrote `/Users/crimsonwheeler/Documents/GitHub/Crimson/Apps/CopilotResearch/chatgpt_runs/chatgpt_run_20260629_072550_1prompts.md` but failed with `composer missing`; no ChatGPT output was captured for this pass.
- Latest GPT-it success: Chrome DevTools Protocol prompt captured a domain-scoped recommendation for `extraction-loop-playability-01`, focused on a local-only playable loop with runtime-owned mining, combat pressure, extraction, receipts, renderer markers, and validation.
- Latest extraction-loop proof: `node tools/validation/validate-goldrush-extraction-loop.mjs` and `npm run check` passed. Browser smoke on `http://localhost:5178/NexusEngine-GoldRush/` walked title -> lobby -> loading train -> gold field -> mine seam -> extraction, producing accepted receipt `extraction-loop-01.goldrush-run-1.receipt`, `cargoValue: 840`, and proof files `reports/goldrush-extraction-loop-01.json`, `reports/goldrush-extraction-loop-01.md`, and `screenshots/goldrush-extraction-loop-01.png`.
- Human-view note: the extraction-loop proof is valid, but the screenshot still shows remaining terrain visual debt with blue/debug-looking gaps. Treat that as the next visual pass, not as final environment parity.
- Latest terrain-gap proof: `node tools/validation/validate-terrain-continuity.mjs` and `npm run check` passed after fixing terrain top-face winding, adding band continuity metadata, and adding skirted band edges. Browser proof `screenshots/terrain-gap-seal-01.png` and `reports/terrain-gap-seal-01.json` found `lowerSkyBlueRatio: 0` and `lowerVeryBlueRatio: 0`.
- Current visual debt after terrain-gap seal: central mountain scale/framing looms too close over the player. That is now the next terrain composition issue, separate from blue/debug terrain gaps.
- Latest public Pages proof: `npm run proof:public -- --url https://luminarylabs-dev.github.io/NexusEngine-GoldRush/` passed. Report: `reports/public-smoke/public-smoke-2026-06-29T18-43-20-972Z.json`; screenshots: `screenshots/public-smoke/01-title-2026-06-29T18-43-20-972Z.png`, `screenshots/public-smoke/02-lobby-2026-06-29T18-43-20-972Z.png`, `screenshots/public-smoke/03-loading-yard-2026-06-29T18-43-20-972Z.png`, `screenshots/public-smoke/04-gold-field-2026-06-29T18-43-20-972Z.png`. It proves the deployed public link reaches `site.gold-field` with 20 players, procedural terrain kits, camera-relative WASD, visible-band terrain raycast, `cannon-es` terrain physics, and passing reality validation.
