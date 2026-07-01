# Train Natural Boarding Proof

Status: active
Date: 2026-06-30

## Domain

Scene transition / loading-yard onboarding / train handoff.

## Sources

- Nielsen Norman Group progress indicator guidance: transition states need visible feedback when users wait or move through a process.
- Xbox accessibility guidance for gameplay cues: important gameplay events and interactable objectives need clear visual/audio indication.
- Unity Cinemachine third-person follow guidance: third-person movement readability depends on a stable target-relative camera.

## AAA Gap

The train scene can pass hidden state checks while still failing as a player sequence if the proof teleports to the door. That would leave the first playable transition dependent on debug helpers instead of player-readable movement, camera direction, and boarding feedback.

## GoldRush Rule

The deploy smoke path must prove the same route a player uses:

```txt
loading-yard spawn
-> wait for train arrival and open-door cue
-> hold camera-relative forward movement toward train
-> enter boarding zone
-> lock to train
-> train departs
-> gold-field run starts
```

## Implementation Note

`tools/proof/public-deploy-smoke.mjs` now records `boardingPath.method: natural-walk-from-loading-yard-spawn` and fails if natural walking does not reach the run scene. The proof no longer uses `publicSmokePlaceAtTrainDoor` as a fallback, so future public proof failures will expose the real train handoff issue instead of masking it.

## Validation

- `node --check tools/proof/public-deploy-smoke.mjs`
- `node tools/validation/validate-scene-sites.mjs`
- `npm run proof:public -- --url <local-or-public-url>`
