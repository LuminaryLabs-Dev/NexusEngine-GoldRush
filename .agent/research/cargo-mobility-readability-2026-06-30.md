# Cargo Mobility Readability

Status: applied

## Intent

Carried gold should change both player behavior and player read. A player who mines gold should immediately understand that the load is valuable, visible, slower, louder, and extraction-oriented.

## Source Notes

- Nielsen Norman Group's system-status visibility heuristic supports immediate feedback after state changes: https://www.nngroup.com/articles/visibility-system-status/
- Game Accessibility Guidelines recommend distinct feedback for important events and objects, which applies to carried loot and extraction cues: https://gameaccessibilityguidelines.com/ensure-sound-music-choices-for-each-key-objects-events-are-distinct-from-each-other/

## Domain Web

```txt
n:goldrush:gold-carrying
├─ goldrush-cargo-mobility-v1
│  ├─ speedMultiplier
│  ├─ sprintMultiplier
│  ├─ staminaDrainScalar
│  ├─ noiseRadiusBonus
│  ├─ postureLean
│  └─ nextAction
├─ goldrush-cargo-visual-v1
│  └─ includes paired mobility snapshot
├─ host movement controller
│  └─ consumes speed/sprint modifiers
└─ n:goldrush:three-scene-renderer
   └─ consumes posture/readability only
```

## AAA Gap Closed

- Before: mined gold showed physical nuggets but movement still felt weightless.
- Now: mined gold exposes a kit-owned mobility contract, movement speed drops below unloaded base walk speed, and the renderer exposes posture lean from the same contract.

## Remaining Gaps

- Stamina drain is exposed but not yet connected to an actual stamina meter.
- Noise radius is exposed but not yet connected to AI/hearing or multiplayer detection.
- Heavy-load animation should eventually blend into authored carry animation after approved legacy animation assets are promoted.
