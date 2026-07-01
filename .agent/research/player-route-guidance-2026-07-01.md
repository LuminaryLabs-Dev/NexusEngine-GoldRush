# Player Route Guidance

Status: browser-proofed

## Purpose

Remove the next layer of proof-helper debt by making the player route from spawn -> gold object -> cashout readable, camera-relative, and kit-owned.

## Source-Backed AAA Gaps

- Apex's official PC settings guidance reinforces that competitive movement and aim need configurable, testable mouse sensitivity, FOV, low-lag performance defaults, and practiceable movement/aim drills. Source: https://help.ea.com/en/articles/apex-legends/best-settings-pc/
- Apex's official netcode deep dive reinforces that a large online shooter needs performance/latency diagnostics, full-state thinking, input-timing proof, and automated bug detection instead of relying on subjective "feels broken" reports. Source: https://www.ea.com/games/apex-legends/apex-legends/news/servers-netcode-developer-deep-dive
- Hunt: Showdown 1896's Colorado update reinforces the GoldRush world targets: western mountains, mines, rail tracks, watch towers, towns/compounds, tactical verticality, noise-readable props, and upgraded audio/performance as core extraction-shooter quality bars. Source: https://www.huntshowdown.com/news/introducing-hunt-showdown-1896-out-now-on-pc-ps5-xbox-series-x-s

## Domain Decision

- `n:goldrush:player-route-guidance` owns route-leg status, current target, target approach radius, action range, and camera-relative WASD hints.
- `n:goldrush:player-action-surface` still owns the visible player prompt and available interactions.
- `n:goldrush:mine-hold-action` and `n:goldrush:cashout-sites` still own accepted/rejected gameplay authority.
- The renderer may show guidance cues later, but it must consume these contracts rather than owning route logic.

## What Changed This Pass

- Added `goldrush-player-route-guidance-v1` snapshots to app/scenario state.
- Added target `actionRadius` and `actionInRange` so route guidance can distinguish "the prompt can appear" from "the player has actually reached the object."
- Updated the browser proof to walk until route guidance reports the held action is ready, not until an arbitrary proof distance is reached.
- Proved natural title -> lobby -> loading yard -> train boarding -> run -> gold-object walk -> held mining -> cashout walk -> held cashout -> results.

## Proof

- Validator: `tools/validation/validate-player-route-guidance.mjs`
- Browser proof: `npm run proof:player-route-guidance`
- Latest retained report: `output/playwright/player-route-guidance-proof/player-route-guidance-2026-07-01T05-27-25-056Z.json`
- Latest retained screenshot: `output/playwright/player-route-guidance-proof/player-route-guidance-2026-07-01T05-27-25-056Z.png`

## Remaining Gaps

- Route guidance is still a proof/control helper, not yet a diegetic player UI.
- The prospector character still needs higher-fidelity rigging, knees, locomotion blending, and held-action animation.
- Mining nodes and cashout sites are functional protokits, but need richer art, collision shape feedback, sound, particles, and reward feedback.
- Multiplayer synchronization for the same route still needs live party/match proof beyond the local simulated route.

## Next Kit Implication

Create a player-facing guidance cue kit that consumes `n:goldrush:player-route-guidance`, `n:goldrush:player-action-surface`, and `n:render:micro-object-instancing` to show in-world direction, distance, and hold-readiness without adding a debug overlay.
