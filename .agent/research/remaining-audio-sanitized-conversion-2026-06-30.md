# Remaining Audio Sanitized Conversion

Status: active

## Question

How should GoldRush move copied legacy audio closer to the playable end state without accidentally promoting unreviewed files into the public runtime?

## External Anchors

- MDN documents browser audio codec/container considerations for web playback; copied MP3, OGG, and WAV files are plausible browser review candidates, but browser support does not equal license approval or runtime promotion: https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Formats/Audio_codecs
- W3C Web Audio defines browser audio graph primitives for future cue mixing, gain, and transitions, which supports a later audio kit that consumes approved runtime paths rather than raw/sanitized paths: https://www.w3.org/TR/webaudio/
- Adaptive game audio systems separate music state, transitions, and cues from raw file storage. That matches the existing GoldRush `goldrush.audio.*` slot approach.

## Decision

Add a batch-scoped sanitized conversion lane for the first remaining audio batch:

```txt
remaining batch receipts
-> tools/import-sanitize/convert-remaining-audio-batch.mjs --write
-> sanitized/converted/.../remaining-batches/<batchId>/
-> reports/conversion/remaining-batches/<batchId>.json
-> sanitized/registry/remaining-batches/<batchId>.json
-> tools/validation/validate-remaining-audio-conversion.mjs
```

This does not modify the first 31-file conversion report and does not write `public/assets/`.

## AAA Gap Framing

High-fidelity extraction games need distinct audio layers:

- title identity.
- exploration/wandering bed.
- combat pressure bed.
- voice and stingers.
- weapon and gold interaction SFX.
- transition cues for lobby, train, match start, extraction, and results.

The current pass moves 15 copied audio files into reviewable sanitized outputs and classifies them into title, voice, combat, and wandering cue families. The missing AAA layer is still a runtime adaptive-music kit that crossfades approved cues based on frontier condition, train transition, combat pressure, final rush, and results.

## Kit Implications

- `n:audio:cue-state` remains the generic promotion candidate for active cue, loop, gain, and transition state.
- `n:goldrush:music-and-stingers` should consume only approved `assets/...` paths after human/license approval.
- `src/audio/goldRushAudioManager.js` should continue reporting pending approved runtime assets until approved records exist.
- Sanitized review outputs should never be imported by runtime code.

## Proof

```txt
node tools/import-sanitize/convert-remaining-audio-batch.mjs --write
node tools/validation/validate-remaining-audio-conversion.mjs
```

Latest result:

```txt
outputs: 15
bytes: 90,145,108
publicPromotion: false
runtimePromotion: false
promotionReady: 0
```
