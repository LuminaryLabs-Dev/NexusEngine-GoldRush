# Train Transition Audio Cues

Status: active

## Question

How should the loading-yard train sequence expose audio feedback without pretending pending legacy audio is approved runtime content?

## Sources

- MDN Web Audio API best practices: browser audio playback is tied to user interaction and `AudioContext` lifecycle, so GoldRush should unlock audio from the Play button and keep later cue playback in a host adapter.
- Game Accessibility Guidelines, distinct sound choices for key objects/events: important game events should have recognizable audio identities instead of reusing one ambiguous sound everywhere.
- Xbox Accessibility Guidelines audio guidance: audio feedback should support gameplay clarity and should not be the only signal for essential information.

Source links:

- https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Best_practices
- https://gameaccessibilityguidelines.com/ensure-sound-music-choices-for-each-key-objects-events-are-distinct-from-each-other/
- https://learn.microsoft.com/en-us/gaming/accessibility/xbox-accessibility-guidelines/117

## Local Interpretation

- The first sequence already owns the semantic train beats: arrival, door opening, boarding, party readiness sync, and departure.
- The renderer already owns the visual in-world door cue.
- The audio manager should subscribe to the same readout, not invent its own train state machine.
- Approved legacy audio remains blocked by the review/promotion gates, so train audio must route through placeholder/procedural cue IDs and expose pending approved runtime assets.

## Implemented Slice

- `goldrush-train-sequence-readout-v1` remains the source of truth for staged train beats.
- `goldrush-train-transition-audio-cues-v1` maps readout beats to deduped one-shot cue records.
- Each train beat now carries a distinct procedural fallback pattern: `train-arrival`, `train-door`, `train-board`, `train-wait`, and `train-depart`.
- `audio.sync({ screen: "loading", ..., trainReadout })` passes the loading-yard readout to the audio host adapter.
- `audioManager.lastTrainCueShots` keeps the latest train cue-state proof visible to browser/Playwright validation.
- Public smoke proof now waits for the boarding cue to exist in both visual state and audio cue-state, then stores a `loadingCheckpoint` before match handoff so retained proof keeps the loading-yard cue evidence.

## Kit Gaps

- `n:audio:cue-state` should eventually become a generic cue-state kit with public APIs for cue registration, dedupe windows, asset resolution, and fallback policy.
- `n:goldrush:music-and-stingers` should own GoldRush-specific train cue mappings, legacy slot choices, and frontier condition audio overrides.
- The current train beat cue map reuses placeholder cues; approved legacy audio should replace those records only after human/license approval.
- Audio accessibility still needs an options surface for volume groups, reduced sudden sounds, subtitles/captions, and persistent visual equivalents.

## Validator Implications

- Keep `tools/validation/validate-first-sequence.mjs` proving train readout beats and distinct `train-*` audio fallback records.
- Keep `tools/validation/validate-scene-sites.mjs` proving the loading screen passes `trainReadout` into `audio.sync` and that all five train beats have distinct fallback patterns.
- Keep Playwright public smoke checking visual boarding cue plus `audioManager.lastTrainCueShots`, and retaining a loading checkpoint separate from final results state.
- Add a later browser proof for audio unlock state, user volume controls, and approved-runtime audio playback once assets are promoted.
