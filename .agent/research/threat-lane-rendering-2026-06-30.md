# Threat Lane Rendering

Status: active

## Sources

- Microsoft Xbox Accessibility Guideline 103: https://learn.microsoft.com/en-us/xbox/accessibility/xbox-accessibility-guidelines/103
- Microsoft Xbox Accessibility Guideline 105: https://learn.microsoft.com/en-us/xbox/accessibility/xbox-accessibility-guidelines/105
- Crytek Devil's Trail Hunt update: https://www.crytek.com/news/devils-trail-transforms-hunt-showdown-1896
- Crytek Road to Hell Hunt update: https://press.crytek.com/road-to-hell-is-live-now-in-hunt-showdown-1896

## Intent

Make GoldRush ambush pressure visible in the world without letting the renderer own combat rules.

## Source Interpretation

Microsoft XAG 103 says important gameplay cues should use multiple sensory methods, and that color alone should not carry critical meaning. For GoldRush this means a threat should have shape, spatial direction, visual pulse, and audio/semantic cue metadata.

Microsoft XAG 105 frames clear feedback as part of making interaction states understandable. For GoldRush this means player shots, damage, and threat escalation need receipts and stable state, not only one-frame effects.

Crytek's Hunt updates emphasize information as a tactical resource: hidden extraction points, scouting, traces, sound, and risk/reward. For GoldRush this supports visible threat lanes during high-risk extraction while keeping broader extraction uncertainty intact.

## Domain Web

```txt
n:goldrush:ambush-pressure
├─ owns threat activation
├─ owns telegraph/lane/cue data
├─ owns combat receipts
└─ renderer consumes only marker metadata

goldrush.procGameplay.extractionLoopMarkers
├─ renders marker rings
├─ renders threat lane ribbons
├─ pulses telegraphed threat beacons
└─ exposes visualContract: readable-threat-lanes-v1
```

## Kit Gaps

- Threat lane rendering is now a renderer adapter over kit-owned data.
- Future audio work should route `marker.cue.audio` into `goldRushAudioManager`.
- Future replay work should promote combat receipts into replay key moments.
- Future cover work should attach cover micro-kits to lane interruption rules.

## Validator Implications

- `validate-goldrush-extraction-loop.mjs` proves the state contract.
- `validate-procedural-renderer-kits.mjs` proves the renderer consumes that contract.
- Browser proof should inspect Three objects named `lane.*.visual` and the scene group `visualContract`.
