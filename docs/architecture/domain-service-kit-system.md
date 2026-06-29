# Domain Service Kit System

Gold Rush now uses a two-layer Domain Service Kit system.

```txt
NexusEngine-GoldRush
├─ generic incubator kits
│  ├─ neutral `n:*:*` domain paths
│  ├─ no GoldRush naming or rules
│  ├─ installed before custom kits
│  └─ candidates for later NexusRealtime promotion
└─ GoldRush custom kits
   ├─ game rules
   ├─ scene flow
   ├─ world/content tuning
   ├─ scoring/results
   └─ renderer/gameplay orchestration
```

## Runtime Shape

```txt
createGoldRushRuntime
└─ createGoldRushDomainKits
   ├─ createGenericIncubatorDomainKits
   │  ├─ n:runtime:domain-registry
   │  ├─ n:runtime:events
   │  ├─ n:runtime:snapshot
   │  ├─ n:runtime:validation
   │  ├─ n:scene:site-loader
   │  ├─ n:scene:transition
   │  ├─ n:network:party-room
   │  ├─ n:network:room-partitions
   │  ├─ n:world:terrain-heightfield
   │  ├─ n:world:terrain-raycast
   │  ├─ n:world:terrain-patches
   │  ├─ n:world:placement-raycast
   │  ├─ n:physics:world
   │  ├─ n:physics:collider
   │  ├─ n:physics:query
   │  ├─ n:control:third-person-camera
   │  ├─ n:control:character-movement
   │  ├─ n:render:three-scene
   │  ├─ n:render:terrain-bands
   │  ├─ n:render:micro-object-instancing
   │  ├─ n:render:character-preview
   │  ├─ n:audio:cue-state
   │  ├─ n:animation:state
   │  ├─ n:gameplay:interaction-hold
   │  ├─ n:gameplay:cargo
   │  ├─ n:gameplay:extraction
   │  ├─ n:gameplay:combat-pressure
   │  ├─ n:match:lifecycle
   │  ├─ n:match:receipts
   │  ├─ n:match:scoring
   │  └─ n:match:results
   ├─ n:goldrush:kit-contracts
   └─ engine.n.goldrush* game kits
```

## Contract Shape

Every kit is documented by the canonical 10-field contract:

```txt
Kit
├─ domainPath
├─ purpose
├─ publicApi
├─ internalApi
├─ events
├─ snapshot
├─ reset
├─ dataExposed
├─ validator
└─ graduationRule
```

The canonical machine-readable catalog is `src/kits/generic-incubator/domainServiceKitCatalog.js`.

## GoldRush Pairing Web

```txt
n:runtime:*   -> n:goldrush:runtime/replay/match-snapshot/reality-status
n:scene:*     -> n:goldrush:scene-flow/train-loading
n:network:*   -> n:goldrush:party-lobby/room-orchestration
n:world:*     -> n:goldrush:desert-terrain/player-grounding/terrain-patch-windows/prop-placement
n:physics:*   -> n:goldrush:terrain-physics/mountain-blockers/ground-probes
n:control:*   -> n:goldrush:exploration-camera/prospector-movement
n:render:*    -> n:goldrush:three-scene-renderer/gold-field-renderer/desert-prop-kits/lobby-character-preview
n:audio:*     -> n:goldrush:music-and-stingers
n:animation:* -> n:goldrush:prospector-animation
n:gameplay:*  -> n:goldrush:mine-hold-action/gold-carrying/cashout-sites/ambush-pressure
n:match:*     -> n:goldrush:match-loop/extraction-receipts/gold-rush-scoring/results-screen
```

The current `engine.n.goldrush*` APIs remain the compatibility facade while behavior is moved behind these contracts incrementally.
