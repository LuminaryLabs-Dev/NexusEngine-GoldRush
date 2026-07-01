# Audio Cue Approval Plan

Status: active

## Purpose

Map pending legacy audio review candidates onto runtime audio cue targets without promoting any file into `public/assets` or runtime manifests.

## Domain

```txt
n:audio:cue-state
└─ n:goldrush:music-and-stingers
   ├─ title music and voice cue targets
   ├─ loading-yard train transition cue targets
   ├─ exploration music cue target
   └─ combat music cue target
```

## Sanitized Default

- Report: `reports/audio-cue-approval/goldrush-train-title-audio-cue-plan.json`
- Generator: `tools/import-sanitize/generate-audio-cue-approval-plan.mjs`
- Validator: `tools/validation/validate-audio-cue-approval-plan.mjs`
- Public/runtime promotion: always `false` in this plan.
- Runtime paths: forbidden in the plan.
- Candidate paths: only sanitized review outputs under `sanitized/converted/goldrush-dual-source-001/`.
- Actual runtime promotion remains owned by `tools/import-sanitize/promote-approved-runtime-assets.mjs` with explicit approval and confirmation flags.

## Current Cue Coverage

```txt
title.music      -> goldrush.audio.music.titleIntro   -> candidate exists
title.voice      -> goldrush.audio.voice.titleIntro   -> candidate exists
train.arrival    -> goldrush.audio.voice.titleIntro   -> candidate exists
train.door       -> goldrush.audio.sfx.goldPickup     -> missing candidate
train.board      -> goldrush.audio.sfx.goldPickup     -> missing candidate
train.wait       -> goldrush.audio.sfx.ambush         -> missing candidate
train.depart     -> goldrush.audio.voice.titleIntro   -> candidate exists
run.exploration  -> goldrush.audio.music.wandering    -> candidates exist
run.combat       -> goldrush.audio.music.combat       -> candidates exist
```

## Why This Is the Right Boundary

- Loading-yard beats need distinct sound patterns so players can understand train arrival, door, boarding, waiting, and departure without reading debug text.
- Browser audio must remain user-gesture and state aware, so runtime playback stays behind the GoldRush audio manager.
- Legacy audio needs track-level identity, license provenance, human review, approval id, and promotion before runtime use.
- Missing train SFX slots should be visible as review gaps, not hidden by using unrelated music assets.

## Sources

- MDN Web Audio API best practices: https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Best_practices
- Game Accessibility Guidelines, distinct sound/music choices: https://gameaccessibilityguidelines.com/ensure-sound-music-choices-for-each-key-objects-events-are-distinct-from-each-other/
- Xbox Accessibility Guideline 117, audio cues: https://learn.microsoft.com/en-us/gaming/accessibility/xbox-accessibility-guidelines/117
- Incompetech license page: https://incompetech.com/music/royalty-free/licenses/
- YouTube Audio Library license help: https://support.google.com/youtube/answer/3376882
- Freesound: https://freesound.org/
