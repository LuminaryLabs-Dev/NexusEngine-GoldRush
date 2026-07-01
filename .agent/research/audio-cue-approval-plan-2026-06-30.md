# Audio Cue Approval Plan Research

Status: active
Date: 2026-06-30

## Question

How should GoldRush move from procedural placeholder audio toward actual legacy audio while staying sanitized, browser-safe, license-safe, and readable as a game?

## Findings

- Players need distinct audio for key events. The loading-yard train sequence should not reuse one generic sound for arrival, door, boarding, waiting, and departure because those beats communicate different actions.
- Browser playback must respect Web Audio lifecycle constraints and user activation patterns. GoldRush should keep playback in `src/audio/goldRushAudioManager.js`, not scatter direct element playback across scene code.
- Legacy music and SFX cannot be promoted from filename matches alone. Each candidate needs identity review, license review, explicit human approval, matching approval id, and the approved runtime promotion bridge.
- Missing SFX slots are useful output. `goldrush.audio.sfx.goldPickup` and `goldrush.audio.sfx.ambush` are currently gaps for train door, board, and wait cues, so the plan should show them instead of silently mapping unrelated tracks.

## Kit Gap

```txt
n:audio:cue-state
└─ needs sanitized approval planning for cue targets

n:goldrush:music-and-stingers
└─ needs train/title/run cue mapping from approved assets when approvals exist
```

## Validator Implication

- `tools/validation/validate-audio-cue-approval-plan.mjs` must prove the cue plan is planner-only.
- It must prove public/runtime promotion is false.
- It must prove no runtime path is present.
- It must prove train fallback patterns remain distinct.
- It must prove missing train SFX slots stay visible.

## Sources

- MDN Web Audio API best practices: https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Best_practices
- Game Accessibility Guidelines, distinct sound/music choices: https://gameaccessibilityguidelines.com/ensure-sound-music-choices-for-each-key-objects-events-are-distinct-from-each-other/
- Xbox Accessibility Guideline 117, audio cues: https://learn.microsoft.com/en-us/gaming/accessibility/xbox-accessibility-guidelines/117
- Incompetech license page: https://incompetech.com/music/royalty-free/licenses/
- YouTube Audio Library license help: https://support.google.com/youtube/answer/3376882
- Freesound: https://freesound.org/
