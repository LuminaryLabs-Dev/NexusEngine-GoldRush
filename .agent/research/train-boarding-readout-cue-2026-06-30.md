# Train Boarding Readout Cue

Status: active

## Question

How should the loading-yard train sequence communicate arrival, door opening, boarding, party sync, and departure without becoming a UI overlay?

## Sources

- Microsoft Xbox Accessibility Guideline 103: visual and audio cues should communicate important gameplay events such as interactable objects and new objectives.
- Microsoft Xbox Accessibility Guideline 105: important audio cues and distinct output should remain available and understandable.
- Unity Cinemachine Third Person Follow: third-person cameras should track a target at a stable relative offset and distance.
- Game Accessibility Guidelines full list: interactive elements need clear indication, and key objects/events should use distinct sound/music choices.

## Interpretation

The train door is an objective and an interactable object. If the only proof is a hidden collision radius, players can miss the intended action, and browser tests can pass while the scene still feels arbitrary.

The correct GoldRush pattern is:

```txt
n:goldrush:first-sequence
-> owns phase, beat, next player action, camera directive
-> exposes player-facing train readout
-> renderer consumes readout
-> renderer shows in-world cue at train door
-> proof validates cue before boarding
```

## Implemented Slice

- Added `goldrush-train-sequence-readout-v1` to the first-sequence snapshot.
- Added current beat, next player action, cue text, readiness flags, camera directive, and boarding cue visibility.
- Added `goldrush-train-boarding-cue-v1` to the loading-yard renderer snapshot.
- Added a door-mounted 3D boarding cue that appears as the train door opens and pulses when boarding is available.
- Routed loading status through the same readout so screen-reader/debug text matches the in-world action.
- Tightened validators and public smoke proof around the cue contract.

## Kit Gaps

- `n:scene:transition` should eventually own generic staged transition readouts.
- `n:audio:cue-state` should add distinct train-arrival, door-open, board-now, and departure cues once approved audio exists.
- `n:control:third-person-camera` should expose named transition camera directives instead of renderer-local follow math.

## Validator Implications

- `validate-first-sequence.mjs` must prove beat/action/camera directives.
- `validate-scene-sites.mjs` must prove the renderer consumes readout data and exposes a cue contract.
- `proof:public` must fail if the public loading-yard scene can board without the visible/snapshot boarding cue.
