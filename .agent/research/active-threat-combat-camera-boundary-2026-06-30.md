# Active Threat Combat Camera Boundary

Status: active
Date: 2026-06-30

## Intent

Make GoldRush perspective shifts feel like one unified extraction game: exploration remains over-the-shoulder travel, while active combat threats move the same runtime into a closer combat presentation.

## External References

- Unity Cinemachine Third Person Follow documentation: https://docs.unity3d.com/Packages/com.unity.cinemachine@3.1/manual/CinemachineThirdPersonFollow.html
- Game Accessibility Guidelines, provide visual alternatives for audio cues: https://gameaccessibilityguidelines.com/provide-visual-alternatives-for-audio-cues/

## Domain Decision

The camera cannot be owned by Three.js or by per-frame proof-pose selection. GoldRush uses the existing kit stack:

```txt
goldrushExtractionLoop
-> readable threat state
-> goldrushRuntime sync boundary
-> goldrushPerspective
-> goldrushCamera
-> goldrushScenes
-> goldrushAudio
-> goldrushAnimation
```

## Implemented Rule

Combat presentation activates when:

```txt
active readable threat
aim mode
fire action
damage receipt
legacy combat mode
```

Combat presentation clears when:

```txt
active threat count is 0
aim is released
legacy mode is not combat
run is not in combat phase
```

## Important Distinction

Frontier-condition danger and extraction-site contest pressure can still influence music, score, cashout value, and readable risk. They must not keep the camera in combat after the active threat is defeated.

## Kit Fit

- `n:goldrush:ambush-pressure`: owns readable threat facts, lanes, telegraphs, and combat receipts.
- `n:goldrush:exploration-camera`: owns over-the-shoulder travel and combat camera descriptors.
- `n:goldrush:scene-flow`: receives combat scene intent and arena reset intent.
- `n:goldrush:music-and-stingers`: may stay tense from frontier danger even when the camera returns to exploration.
- `n:goldrush:prospector-animation`: follows combat-active state for aiming posture.

## Proof

`tools/validation/validate-nexus-runtime.mjs` now proves:

```txt
mine extraction-loop gold
walk into active threat radius
active threat switches perspective/camera/audio/animation/scene into combat
fire twice to defeat the threat
cleared threat returns camera, animation posture, and scene intent to exploration
damage still forces combat and puts carried gold at risk
```

## Remaining AAA Gaps

- Combat still lacks authored hit reactions, weapon recoil, muzzle VFX, cover snapping, and enemy behavior.
- Threat lane rendering is readable but still procedural.
- Approved legacy character, weapon, animation, and SFX assets remain blocked on review/promotion.
- Camera collision, shoulder swapping, and cover occlusion need a future browser proof pass.
