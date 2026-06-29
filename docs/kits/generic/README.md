# Generic Incubator Kits

These kits are local NexusRealtime-style incubator contracts. They are installed before GoldRush custom kits and expose neutral `engine.n.*` APIs for contract proof.

```txt
generic/
├─ runtime
├─ scene
├─ network
├─ world
├─ physics
├─ control
├─ render
├─ audio
├─ animation
├─ gameplay
└─ match
```

Each kit contract has the same 10 documented points: `domainPath`, `purpose`, `publicApi`, `internalApi`, `events`, `snapshot`, `reset`, `dataExposed`, `validator`, and `graduationRule`.

## Runtime

- `n:runtime:domain-registry`
- `n:runtime:events`
- `n:runtime:snapshot`
- `n:runtime:validation`

## Scene

- `n:scene:site-loader`
- `n:scene:transition`

## Network

- `n:network:party-room`
- `n:network:room-partitions`

## World

- `n:world:terrain-heightfield`
- `n:world:terrain-raycast`
- `n:world:terrain-patches`
- `n:world:placement-raycast`

## Physics

- `n:physics:world`
- `n:physics:collider`
- `n:physics:query`

## Control

- `n:control:third-person-camera`
- `n:control:character-movement`

## Render

- `n:render:three-scene`
- `n:render:terrain-bands`
- `n:render:micro-object-instancing`
- `n:render:character-preview`

## Audio And Animation

- `n:audio:cue-state`
- `n:animation:state`

## Gameplay

- `n:gameplay:interaction-hold`
- `n:gameplay:cargo`
- `n:gameplay:extraction`
- `n:gameplay:combat-pressure`

## Match

- `n:match:lifecycle`
- `n:match:receipts`
- `n:match:scoring`
- `n:match:results`

The canonical 10-point details live in `src/kits/generic-incubator/domainServiceKitCatalog.js` and are validated by `tools/validation/validate-domain-kit-contracts.mjs`.
