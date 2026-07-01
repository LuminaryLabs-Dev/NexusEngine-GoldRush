# Combat Cover Readability

Status: active

## Sources

- Microsoft Xbox Accessibility Guideline 103: https://learn.microsoft.com/en-us/xbox/accessibility/xbox-accessibility-guidelines/103
- Microsoft Xbox Accessibility Guideline 105: https://learn.microsoft.com/en-us/xbox/accessibility/xbox-accessibility-guidelines/105
- Unity Cinemachine Third Person Follow: https://docs.unity3d.com/Packages/com.unity.cinemachine@3.0/manual/CinemachineThirdPersonFollow.html
- Game Accessibility Guidelines audio distinction: https://gameaccessibilityguidelines.com/ensure-sound-music-choices-for-each-key-objects-events-are-distinct-from-each-other/

## Intent

GoldRush combat needs readable tactical counterplay, not only threat pressure. When an ambush lane appears, the player should know which nearby rock/cart/ridge can break line of sight, which shoulder side should peek, and whether the cover is currently useful.

## Source Interpretation

Microsoft cue guidance supports redundant sensory and visual state for important gameplay information. GoldRush should keep threat lanes, cover silhouettes, and audio cues as separate readable facts so players are not forced to infer danger from one signal.

Unity's third-person follow camera model reinforces that shoulder framing is a camera-relative contract. GoldRush cover descriptors should therefore carry `cameraShoulder` and `peekSide` so the camera system can later switch around cover without guessing from renderer geometry.

Game Accessibility Guidelines' audio distinction point supports keeping threat and cover cues distinct from music/ambience. Cover should expose semantic cue IDs now, even while approved legacy audio remains blocked.

## Domain Web

```txt
n:goldrush:ambush-pressure
├─ threat lane
├─ telegraph
├─ cover descriptors
│  ├─ rock outcrop
│  ├─ ore cart
│  └─ ridge shoulder
├─ recommended cover id
├─ peek side
└─ camera shoulder

goldrush.procGameplay.extractionLoopMarkers
├─ marker rings
├─ danger lane ribbons
└─ cover markers from kit-owned descriptors
```

## Kit Gaps

- Cover descriptors now belong to `engine.n.goldrushExtractionLoop` under `n:goldrush:ambush-pressure`.
- The renderer only draws `readable-threat-cover-v1`; it does not select cover or score exposure.
- Future movement work should let the player snap, lean, or peek against `recommendedCoverId`.
- Future camera work should consume `cameraShoulder` for shoulder swapping while aiming near cover.
- Future audio work should map `cover.cue` and lane/telegraph cues into distinct approved runtime SFX.
- Current engagement work lets the player hold cover, enter peeking state, reduce incoming damage, and carry cover ids plus mitigation totals into results/replay receipts.

## Validator Implications

- Extraction-loop validation must prove each readable threat exposes cover, lane-blocking status, and a recommended cover ID.
- Extraction-loop validation must prove `goldrush-cover-engagement-v1`, damage mitigation, and result/replay summaries.
- Renderer validation must prove `readable-threat-cover-v1` is a visual contract, not a renderer rule.
- Browser proof should assert the recommended cover mesh exists next to the active claim-jumper threat.
