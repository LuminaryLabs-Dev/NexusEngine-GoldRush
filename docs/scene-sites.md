# Gold Rush Scene Sites

Gold Rush now treats major scenes as separate sites so each site can load a different kit group.

## Site Map

| Site | Screen | Kit groups | Purpose |
| --- | --- | --- | --- |
| `site.start` | `start` | `title-audio` | Title entry without gameplay kits mounted. |
| `site.lobby-character` | `lobby` | `peer-party-room`, `three-lobby-character`, `room-selection`, `frontier-condition-briefing` | Party setup, run-condition briefing, and draggable Three.js character preview. |
| `site.loading-yard` | `loading` | `loading-yard-terrain`, `party-presence`, `walkable-player`, `train-departure`, `frontier-condition-briefing` | Small pre-match train yard where players retain the run-condition briefing before boarding. |
| `site.gold-field` | `run` | `goldrush-runtime`, `procedural-terrain`, `object-micro-kits`, `network-orchestration` | Main NexusRealtime gold field runtime. |
| `site.results` | `results` | `goldrush-runtime`, `results-summary`, `replay-summary` | Post-extraction winner, score, contest, award, and replay summary. |

## Flow

```txt
start -> lobby-character -> loading-yard -> gold-field -> results
```

The lobby `Start` action does not jump straight into the match. It broadcasts the PeerJS party start, carries the active frontier-condition briefing and party roster into the first-sequence payload, enters the loading-yard site, lets the local player walk to the train, writes a party boarding manifest, records local and auto-follow boarding receipts, plays the train departure, then hands off to the 20-player gold-field runtime. A completed extraction finalizes through the match/result kits once and activates the results site.

## Runtime Contract

`createGoldRushSceneKitLoader()` activates kit groups when the active screen changes. `window.GoldRushHost.getState().sceneKitLoader` exposes activation receipts, loaded modules, and active groups for browser validation. This keeps the start screen, party lobby, loading yard, gold field, and results summary from loading the same kit stack.

`src/scenes/goldRushFirstSequence.js` owns the launch handoff contract. Its loading snapshot exposes `boardingManifest` and `boardingStatus` under `goldrush-train-boarding-v1`, so tests can prove who is waiting, who boarded locally, who auto-followed, when the party became ready, and when the handoff payload was consumed.

The same snapshot now exposes `goldrush-train-sequence-readout-v1`: current beat, next player action, player cue, readiness flags, camera directive, and boarding cue visibility. `src/renderer/loadingTrainSceneRenderer.js` consumes that readout and exposes `goldrush-train-boarding-cue-v1`, an in-world train-door cue that appears as the door opens and pulses when boarding is available. This keeps train arrival, door opening, boarding, party sync, and departure readable without adding a flat UI overlay.

The browser audio adapter also consumes the same train readout. `src/audio/goldRushAudioManager.js` maps each readout beat into `goldrush-train-transition-audio-cues-v1` one-shots and keeps recent cue shots in `audioManager.lastTrainCueShots`. The implementation intentionally reuses existing placeholder cue IDs until approved legacy audio has passed human/license review and runtime promotion, but each train beat has a distinct procedural fallback pattern: `train-arrival`, `train-door`, `train-board`, `train-wait`, and `train-depart`.

`src/network/peerPartyRoom.js` mirrors each browser's local boarding status into `goldrush-peer-party-boarding-sync-v1`. PeerJS only fans out readiness; it does not own match authority. The peer readiness snapshot counts only actual per-browser local-boarded reports, so local auto-followed seats do not pretend that remote clients boarded.

The train handoff has a second gate: `goldrush-peer-handoff-gate-v1`. Local boarding locks the player to the train, but multi-member parties do not start train departure until the PeerJS readiness snapshot reports every active member locally boarded. While waiting, the first sequence stays in `boarding-syncing`; once the gate is ready it writes `train-departure-started` and proceeds toward `handoff-ready`.

Late disconnects use `reduce-roster-require-remaining`: if a party member leaves or the PeerJS connection closes during `boarding-syncing`, `goldrush-peer-party-boarding-sync-v1` removes that member from the active readiness roster, records a disconnect receipt, rejects stale reports from the old member id, and forces the remaining local client to republish its boarding report. The handoff gate then releases only if the remaining active roster is ready.

## Validation

`tools/validation/validate-scene-sites.mjs` checks that every site has a unique id, a screen, kit groups, dynamic renderer imports, activation receipts, the loading-yard boarding cue contract, the train transition audio cue-state contract, distinct train fallback patterns, and the required render handoff code. `tools/validation/validate-first-sequence.mjs` proves the staged train readout and cue shots through arrival, door, board-now, party-sync, and departure beats. Public smoke proof retains a `loadingCheckpoint` so the saved report preserves loading-yard visual/audio cue evidence even after the run reaches results. `tools/validation/validate-peer-party-boarding.mjs` proves the peer party boarding sync contract, including missing members, per-peer local readiness, and hydrated fanout snapshots.

`npm run proof:peer-party-boarding` is the live browser proof for that contract. It opens host and member contexts, creates and joins a PeerJS party code, launches `site.loading-yard`, boards both clients, and requires both clients to see `goldrush-peer-party-boarding-sync-v1` with `readyCount: 2`, `expectedCount: 2`, and `allReady: true`. It also requires both clients to expose `goldrush-peer-handoff-gate-v1` as required and ready before train departure.

`npm run proof:peer-party-disconnect` is the reduced-roster browser proof. It opens host and member contexts, launches the loading yard, boards the host, lets the member leave before boarding, and requires the host to reduce to `1/1`, record one disconnect receipt, expose the disconnected member id through `goldrush-peer-handoff-gate-v1`, and depart the train.
