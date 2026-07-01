# Readable Threat Audio Cues

Status: active

## Purpose

Document why GoldRush threat lanes need an audio consumer in addition to visual lane rendering.

## Sources

- Microsoft Xbox Accessibility Guideline 103: https://learn.microsoft.com/en-us/xbox/accessibility/xbox-accessibility-guidelines/103
- Microsoft Xbox Accessibility Guideline 105: https://learn.microsoft.com/en-us/xbox/accessibility/xbox-accessibility-guidelines/105
- Game Accessibility Guidelines: https://gameaccessibilityguidelines.com/ensure-that-all-important-supplementary-information-eg-the-direction-you-are-being-shot-from-conveyed-by-audio-is-replicated-in-text-visuals/

## Domain Findings

- Key combat warnings should not depend on one sensory channel.
- Visual danger lanes need matching sound cues so the player can perceive pressure without staring at the lane.
- Audio-only danger is also insufficient; GoldRush already renders visual lanes, so the correct next step is a redundant audio adapter.
- Active gameplay SFX should be separable from music later, because music and ambience can mask threat information.
- Repeated threat cues must be deduped by telegraph/state, not played every frame.

## Kit Gap

```txt
n:goldrush:ambush-pressure
└─ owns telegraph, lane, and multisensory cue facts

goldRushAudioManager
└─ consumes cue facts and emits deduped host-audio one-shots
```

## Implementation Implication

- Do not move threat logic into the audio manager.
- Do not make the renderer decide audio.
- Read `extractionLoop.combat.readability.threats[*].telegraph.multisensory.audio`.
- Emit one-shot cue packets under a named host-audio contract.
- Keep actual legacy SFX blocked until approved runtime audio promotion.

## Validator Implication

- A validator should prove that an active readable threat creates at least one deduped audio cue.
- The cue should reference the same telegraph and lane IDs used by renderer proof.
- Current placeholder mapping can use `goldrush.audio.sfx.ambush`, but it must remain visibly marked as pending approved runtime audio.
