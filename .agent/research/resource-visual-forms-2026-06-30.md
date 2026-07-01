# Resource Visual Forms Research - 2026-06-30

## Scope

Replace generic black/ore lumps with readable procedural resource forms while keeping each object as a GoldRush-local object protokit.

## Sources

- Game Accessibility Guidelines full list: https://gameaccessibilityguidelines.com/full-list/
- Nielsen Norman Group, Visibility of System Status: https://www.nngroup.com/articles/visibility-system-status/
- Nielsen Norman Group, Proximity Principle in Visual Design: https://www.nngroup.com/articles/gestalt-proximity/

## Domain Decision

`n:render:micro-object-instancing` owns the visual form because this is Three.js presentation over existing object protokit data.

`n:goldrush:object:*` protokits keep identity, interaction, placement, and gameplay target data.

## Why

- Mineable resources must be recognized from camera distance by shape, value color, and silhouette.
- Generic dark boulders create false combat/cover reads and hide the selected mining cue.
- Resource families need separate forms: nugget cluster, ore lode, exposed seam, and tailings fan.

## Implementation Contract

```txt
goldrush-resource-visual-forms-v1
├─ domainPath: n:render:micro-object-instancing
├─ consumes: goldrush-procedural-object-protokit
├─ forms
│  ├─ gold-nugget-cluster
│  ├─ ore-lode-chip
│  ├─ gold-seam-lode
│  └─ tailings-fan
└─ snapshot: resourceKitCount, forms, goldReadableCount, oreReadableCount
```

## Validation

- Procedural renderer validator requires the resource visual form helpers and contract.
- Cargo visual browser proof requires all four resource forms and positive gold/ore readable counts.
