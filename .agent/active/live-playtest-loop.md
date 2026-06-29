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

## Current Controls

- Start: `Play`
- Lobby: drag the 3D skeleton prospector to rotate it; use the `Group Type` dropdown for `Crew`, `Posse`, or `Outfit`; optionally press `Create Code` and share the party code; followers enter the code and press `Join Party`; the leader presses `Start`
- Loading yard: use `WASD` to walk to the train; reaching the train starts departure and hands off to the gold field
- In game:
  - `M`: mine gold
  - `C`: cash out
  - `F`: ambush/combat pressure
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
