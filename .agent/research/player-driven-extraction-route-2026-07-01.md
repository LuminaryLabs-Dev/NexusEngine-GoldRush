# Player Driven Extraction Route

Status: browser-proofed

## Purpose

Track the shift from helper-driven extraction proof toward a player-facing, domain-owned mine -> carry -> cashout -> score route.

## Source-Backed AAA Gaps

- Hunt: Showdown 1896's Colorado map framing highlights why GoldRush needs readable western verticality, mines, towns, rail tracks, watch towers, and noisy wildlife or props that can reveal players. Source: https://www.huntshowdown.com/news/introducing-hunt-showdown-1896-out-now-on-pc-ps5-xbox-series-x-s
- Hunt's event scoring and bounty extraction framing reinforces that extraction should produce visible, receipt-backed rewards and team-readable activity outcomes, not hidden debug completion.
- Apex's netcode deep dive reinforces that large online shooters need visible performance/latency diagnostics, server/tick assumptions, and automation for detecting timing failures before claiming multiplayer reliability. Source: https://www.ea.com/games/apex-legends/apex-legends/news/servers-netcode-developer-deep-dive
- The current GoldRush route still needs a public human-view proof that walks or routes to resource and cashout locations instead of proof-placing near them.

## Current Route Matrix

| Stage | Owning Domain | Current Status | Proof Direction |
|---|---|---:|---|
| Select readable gold object | `n:gameplay:interaction-hold` | resolved in CLI/browser proof | object protokit affordance selection |
| Hold input to mine | `n:goldrush:mine-hold-action` | resolved in CLI/browser proof | `tickExtractionLoop(input.interact)` |
| Carry visible gold | `n:goldrush:gold-carrying` | resolved in CLI/browser proof | cargo visual, mobility, noise pressure |
| Reach and hold cashout | `n:goldrush:cashout-sites` | resolved in CLI/browser proof | `tickExtractionLoop(input.interact)` |
| Receipt-backed results | `n:match:results` | resolved in CLI/browser proof | extraction receipt -> scoring -> results |

## What Changed This Pass

- Added `n:goldrush:player-driven-extraction-route` as a GoldRush custom kit.
- The kit exposes `goldrush-player-driven-extraction-route-v1` with a five-stage matrix, resolved/player-driven counts, helper debt, and next gap.
- Runtime `tickExtractionLoop` now syncs player-driven mining and cashout completions into the isolated ProtoKit bridge.
- The app interact path now lets `E` fall through to extraction-loop cashout when no object affordance owns the interaction.
- Scenario and app state now expose `playerDrivenExtractionRoute`.
- Browser proof now resolves all five route matrix stages and captures sanitized screenshot/report artifacts.

## Still Fake Or Prototype

- Browser proof still uses proof placement helpers for starting near a resource or cashout setpiece.
- The headless validator proves the real input/tick path, but it does not prove a full visual walk from spawn to mine to depot.
- Combat pressure is receipt/telegraph-backed, but the weapon feel, enemy AI, hit reactions, and readable combat traversal are still prototype debt.
- High-fidelity character animation, approved legacy assets, and approved actual audio remain blocked by review/promotion gates.

## Next Proof Target

Create or update a Playwright proof that:

1. Enters the run scene through the normal title/lobby/loading flow.
2. Uses camera-relative WASD to approach a gold object protokit, not proof placement.
3. Holds `E` until the mining receipt exists.
4. Uses camera-relative movement or route autopilot to reach `rail-depot-extract-01`, not direct extraction.
5. Holds `E` until `playerDrivenExtractionRoute.matrix.routeStatus === "resolved"`.
6. Captures screenshot proof plus sanitized route matrix evidence.
