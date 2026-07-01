# Readable Threat Lanes

Status: active

## Sources

- Microsoft Xbox Accessibility Guideline 103: https://learn.microsoft.com/en-us/gaming/accessibility/xbox-accessibility-guidelines/103
- Microsoft Xbox Accessibility Guideline 105: https://learn.microsoft.com/en-us/xbox/accessibility/xbox-accessibility-guidelines/105
- Crytek Hunt: Showdown 1896 Devil's Trail update: https://www.crytek.com/news/devils-trail-transforms-hunt-showdown-1896
- Crytek Road to Hell extraction-point reveal note: https://press.crytek.com/road-to-hell-is-live-now-in-hunt-showdown-1896

## Intent

GoldRush combat should be readable before it is punishing. The player needs to understand where a threat is, what line is dangerous, what cue is firing, and what counterplay exists before damage interrupts mining or extraction.

## Domain Web

```txt
combat readability
├─ threat telegraph
│  ├─ visual cue
│  ├─ audio cue
│  └─ shape/lane cue
├─ danger lane
│  ├─ threat position
│  ├─ player position
│  ├─ lane width
│  └─ status: latent/warning/danger/clear
├─ counterplay
│  ├─ break line of sight
│  ├─ fire back
│  └─ move to cover
└─ receipts
   ├─ player-shot
   ├─ player-damaged
   └─ replay-safe receipt id
```

## Source Interpretation

Microsoft's cue guidance supports using multiple sensory channels for important combat information, so GoldRush threat packets should include visual, audio, and shape cues instead of relying on color or sound alone.

Crytek's current Hunt updates keep extraction information and routes as tactical pressure, so GoldRush should preserve uncertainty at extraction while still making immediate danger readable through lanes and telegraphs.

## Kit Implications

- `n:goldrush:ambush-pressure` should expose `readability`, `telegraph`, `lane`, and `receipts`.
- `n:goldrush:cashout-sites` should continue to call threats from contested extraction sites.
- The renderer should draw from `extractionLoop.worldSpaceMarkers`; it should not decide combat activation or damage.
- Results/replay can later summarize combat receipts without reading renderer state.

## Validator Implications

- Extraction-loop validation should prove every threat has a deterministic lane id.
- Threats should expose visual/audio/shape cues.
- Player shots and damage should write combat receipts.
- Damage receipts should reference the telegraph/lane that made the hit readable.

## Next Gaps

- Add cover descriptors near extraction lanes.
- Add authored or procedural hit reactions.
- Draw lane geometry and telegraph cues in Three.js.
- Convert combat receipts into replay moments and result awards.
