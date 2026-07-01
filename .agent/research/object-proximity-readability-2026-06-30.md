# Object Proximity Readability Research - 2026-06-30

## Scope

Reduce selected-interaction clutter around the player without deleting procedural richness from the wider gold field.

## Sources

- Game Accessibility Guidelines full list: https://gameaccessibilityguidelines.com/full-list/
- Nielsen Norman Group, Visibility of System Status: https://www.nngroup.com/articles/visibility-system-status/
- Nielsen Norman Group, Proximity Principle in Visual Design: https://www.nngroup.com/articles/gestalt-proximity/

## Domain Decision

`n:render:micro-object-instancing` owns visual-density compression because it changes only renderer instance transforms.

`n:gameplay:interaction-hold` remains the selected-affordance authority.

`n:control:character-movement` remains the player-position authority.

## Why

- Dense micro-object fields should support world richness at distance but must not obscure the local player, selected object, or interaction cue.
- The selected object must stay protected and readable.
- Nearby nonselected gold/terrain/navigation dressing can compress at the renderer layer because gameplay target selection and object contracts remain unchanged.

## Implementation Contract

```txt
goldrush-object-proximity-readability-v1
├─ domainPath: n:render:micro-object-instancing
├─ consumes
│  ├─ n:gameplay:interaction-hold
│  └─ n:control:character-movement
├─ selected object: protected scale
├─ nearby candidates: compressed
├─ local clutter: strongly compressed
└─ snapshot: selectedProtected, compressedCount, compressedFamilies, clearanceRadius
```

## Validation

- Procedural renderer validator requires the contract and density pass.
- Cargo visual browser proof requires one selected object protected and at least one nearby nonselected object compressed.
