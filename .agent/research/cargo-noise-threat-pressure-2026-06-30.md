# Cargo Noise Threat Pressure

Status: applied

## Intent

Carried gold should not only slow the player and show visible nuggets. It should also create readable risk: a loaded prospector makes more noise, widens claim-jumper detection, and raises ambush pressure.

## Source Notes

- Nielsen Norman Group's visibility-of-system-status heuristic supports immediate state feedback after important changes: https://www.nngroup.com/articles/visibility-system-status/
- Game Accessibility Guidelines recommend distinct feedback for key objects and events, which applies to carried loot, stealth risk, and ambush telegraphs: https://gameaccessibilityguidelines.com/ensure-sound-music-choices-for-each-key-objects-events-are-distinct-from-each-other/

## Domain Web

```txt
n:goldrush:gold-carrying
├─ goldrush-cargo-mobility-v1
│  └─ source for noiseRadiusBonus
├─ goldrush-cargo-noise-pressure-v1
│  ├─ detectionRadiusBonus
│  ├─ pressureBonus
│  ├─ suspicionRatio
│  ├─ audibleCue
│  └─ stealthRead
└─ n:goldrush:ambush-pressure
   ├─ consumes detectionRadiusBonus
   ├─ raises threat pressure
   ├─ exposes cargoNoisePressure on threat readability
   └─ carries cargoNoisePressure into world-space threat markers
```

## AAA Gap Closed

- Before: cargo exposed `noiseRadiusBonus`, but threats did not consume or explain it.
- Now: carried gold creates a `goldrush-cargo-noise-pressure-v1` snapshot and ambush readability exposes how the carried load affects claim-jumper detection.

## Validator And Proof Implications

- `tools/validation/validate-goldrush-extraction-loop.mjs` asserts cargo noise pressure, detection-radius bonus, pressure bonus, threat readability, and marker metadata.
- `tools/proof/cargo-visual-proof.mjs` asserts browser-visible mine -> carry -> threat-noise behavior.
- Latest proof: `output/playwright/cargo-visual-proof/cargo-visual-2026-06-30T21-14-07-924Z.json`.

## Remaining Gaps

- The `audibleCue` is semantic only; it still needs a distinct approved/fallback sound path in the audio manager.
- AI hearing is not a full simulation yet; this is deterministic threat pressure, not stealth pathfinding.
- Multiplayer disclosure needs a future rule for how much cargo-noise information other players can observe.
