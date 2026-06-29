# Graduation Rules

Generic incubator kits can graduate to NexusRealtime only after they meet every rule.

```txt
graduation gate
├─ no GoldRush naming
├─ no GoldRush rules
├─ stable domainPath
├─ publicApi documented
├─ internalApi documented
├─ events documented
├─ snapshot documented
├─ reset documented
├─ validator passing
└─ proof outside one game
```

## Promotable Layer

These kits are intentionally neutral:

```txt
n:runtime:domain-registry
n:runtime:events
n:runtime:snapshot
n:runtime:validation
n:scene:site-loader
n:scene:transition
n:network:party-room
n:network:room-partitions
n:world:terrain-heightfield
n:world:terrain-raycast
n:world:terrain-patches
n:world:placement-raycast
n:physics:world
n:physics:collider
n:physics:query
n:control:third-person-camera
n:control:character-movement
n:render:three-scene
n:render:terrain-bands
n:render:micro-object-instancing
n:render:character-preview
n:audio:cue-state
n:animation:state
n:gameplay:interaction-hold
n:gameplay:cargo
n:gameplay:extraction
n:gameplay:combat-pressure
n:match:lifecycle
n:match:receipts
n:match:scoring
n:match:results
```

## Non-Promotable Layer

These remain GoldRush-specific unless rewritten as neutral capabilities:

```txt
n:goldrush:runtime
n:goldrush:replay-summary
n:goldrush:match-snapshot
n:goldrush:reality-status
n:goldrush:scene-flow
n:goldrush:train-loading
n:goldrush:party-lobby
n:goldrush:room-orchestration
n:goldrush:desert-terrain
n:goldrush:player-grounding
n:goldrush:terrain-patch-windows
n:goldrush:prop-placement
n:goldrush:terrain-physics
n:goldrush:mountain-blockers
n:goldrush:ground-probes
n:goldrush:exploration-camera
n:goldrush:prospector-movement
n:goldrush:three-scene-renderer
n:goldrush:gold-field-renderer
n:goldrush:desert-prop-kits
n:goldrush:lobby-character-preview
n:goldrush:music-and-stingers
n:goldrush:prospector-animation
n:goldrush:mine-hold-action
n:goldrush:gold-carrying
n:goldrush:cashout-sites
n:goldrush:ambush-pressure
n:goldrush:match-loop
n:goldrush:extraction-receipts
n:goldrush:gold-rush-scoring
n:goldrush:results-screen
```
