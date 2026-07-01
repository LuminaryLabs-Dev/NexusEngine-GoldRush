# Selected Affordance Cue Research - 2026-06-30

## Scope

Add a GoldRush-local renderer cue for the selected object affordance without moving selection, mining, or hold logic into the renderer.

## Sources

- Game Accessibility Guidelines full list: https://gameaccessibilityguidelines.com/full-list/
- Nielsen Norman Group, Visibility of System Status: https://www.nngroup.com/articles/visibility-system-status/
- Unity XR Interaction Toolkit affordance system: https://docs.unity3d.com/Packages/com.unity.xr.interaction.toolkit@2.5/manual/affordance-system.html

## Domain Decision

`n:gameplay:interaction-hold` owns which object is selected.

`n:goldrush:mine-hold-action` owns mining progress and completion state.

`n:render:micro-object-instancing` owns the visible selected cue only.

## Why

- Game Accessibility Guidelines calls out clear indication that interactive elements are interactive and avoiding essential information through only one channel.
- NN/g visibility-of-system-status guidance supports immediate feedback and progress indication when an action takes longer than an instant.
- Unity's affordance model separates state providers from affordance receivers, which maps cleanly to gameplay kits providing state and renderer kits consuming it.

## Implementation Contract

```txt
goldrush-selected-affordance-cue-v1
├─ domainPath: n:render:micro-object-instancing
├─ consumes
│  ├─ n:gameplay:interaction-hold
│  └─ n:goldrush:mine-hold-action
├─ role: selected-in-world-claim-cue
├─ visual: diegetic claim stake plus progress ring
├─ no HUD overlay
└─ snapshot: selectedKitId, action, target, progress, status
```

## Validation

- Procedural renderer validator must require the selected cue contract.
- Cargo visual browser proof must prove the selected cue is visible, renderer-owned, normalized, and points at the same selected kit as marker readability.
