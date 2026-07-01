# Cover Engagement Counterplay

Status: active
Date: 2026-06-30

## Sources

- Microsoft XAG 103, additional channels for visual and audio cues: https://learn.microsoft.com/en-us/xbox/accessibility/xbox-accessibility-guidelines/103
- Microsoft XAG 105, accessible input/control design: https://learn.microsoft.com/en-us/xbox/accessibility/xbox-accessibility-guidelines/105
- Unity Cinemachine Third Person Follow: https://docs.unity3d.com/Packages/com.unity.cinemachine@3.0/manual/CinemachineThirdPersonFollow.html
- Game Accessibility Guidelines, distinct sound/music choices: https://gameaccessibilityguidelines.com/ensure-sound-music-choices-for-each-key-objects-events-are-distinct-from-each-other/

## Intent

GoldRush cover should be actionable counterplay, not only a highlighted prop. When an ambush lane appears, the player should be able to engage cover, peek from it, mitigate incoming damage, and see that mitigation carried into results/replay receipts.

## Source Interpretation

- XAG 103 supports redundant cueing for enemy fire and danger. Cover state should therefore be exposed as data, visual markers, result receipts, and future audio/haptic cues.
- XAG 105 reinforces that the action must be controllable and remappable later; this first slice adds a simple hold-cover input path while keeping the kit API independent from keyboard choice.
- Cinemachine third-person follow keeps shoulder framing as an explicit camera concern. Cover descriptors and engagement state carry `peekSide` and `cameraShoulder` so later camera work can shoulder-swap without renderer guessing.
- Distinct audio guidance means cover, threat, damage, and extraction cues should remain separate semantic facts even while approved legacy audio is still pending.

## Domain Web

```txt
n:goldrush:ambush-pressure
├─ readable threat lane
├─ recommended cover descriptors
├─ cover engagement state
│  ├─ engaged
│  ├─ peeking
│  ├─ damage reduction
│  └─ damage mitigated receipts
└─ results/replay mitigation summary

host input
├─ Q hold cover
├─ simulator command: cover
└─ browser proof action: engageCover

renderer
├─ draws cover descriptors
└─ highlights engaged cover id
```

## Kit Gaps

- Cover engagement belongs to `engine.n.goldrushExtractionLoop`, not renderer code.
- The host can request cover through keyboard/simulator/debug actions, but the kit chooses the threat, cover id, mitigation, and receipts.
- Results and replay must expose `damageMitigated`, `baseDamageTaken`, and `coverIds` so cover counterplay is not lost after extraction.
- Future work should add shoulder-swap camera behavior from `coverEngagement.cameraShoulder`.
- Future work should add distinct SFX/haptics for engage, peek, blocked shot, and cover break.

## Validator Implications

- Extraction-loop validation must prove `goldrush-cover-engagement-v1`, engaged cover ids, peeking state, reduced damage, mitigation receipts, and results/replay mitigation summary.
- Renderer validation must prove engaged cover ids remain kit-owned marker state.
- Browser proof must assert the engaged cover mesh appears alongside the active threat lane.
