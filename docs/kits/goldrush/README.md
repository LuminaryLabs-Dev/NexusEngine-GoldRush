# GoldRush Custom Kits

GoldRush custom kits connect generic contracts into the actual game loop, content, scene flow, and scoring rules.

```txt
goldrush/
├─ runtime
├─ scenes
├─ network
├─ world
├─ physics
├─ player
├─ renderer
├─ audio-animation
├─ gameplay
└─ match
```

Each kit contract has the same 10 documented points: `domainPath`, `purpose`, `publicApi`, `internalApi`, `events`, `snapshot`, `reset`, `dataExposed`, `validator`, and `graduationRule`.

## Runtime And Proof

- `n:goldrush:runtime`
- `n:goldrush:replay-summary`
- `n:goldrush:match-snapshot`
- `n:goldrush:reality-status`

## Scene And Network

- `n:goldrush:scene-flow`
- `n:goldrush:train-loading`
- `n:goldrush:party-lobby`
- `n:goldrush:room-orchestration`

## World And Physics

- `n:goldrush:desert-terrain`
- `n:goldrush:player-grounding`
- `n:goldrush:terrain-patch-windows`
- `n:goldrush:prop-placement`
- `n:goldrush:frontier-conditions`
- `n:goldrush:terrain-physics`
- `n:goldrush:mountain-blockers`
- `n:goldrush:ground-probes`

## Player And Renderer

- `n:goldrush:exploration-camera`
- `n:goldrush:prospector-movement`
- `n:goldrush:three-scene-renderer`
- `n:goldrush:gold-field-renderer`
- `n:goldrush:desert-prop-kits`
- `n:goldrush:lobby-character-preview`

## Audio, Animation, Gameplay, Match

- `n:goldrush:music-and-stingers`
- `n:goldrush:prospector-animation`
- `n:goldrush:mine-hold-action`
- `n:goldrush:gold-carrying`
- `n:goldrush:cashout-sites`
- `n:goldrush:ambush-pressure`
- `n:goldrush:player-action-surface`
- `n:goldrush:player-driven-extraction-route`
- `n:goldrush:player-route-guidance`
- `n:goldrush:match-loop`
- `n:goldrush:extraction-receipts`
- `n:goldrush:gold-rush-scoring`
- `n:goldrush:results-screen`

The canonical 10-point details live in `src/kits/generic-incubator/domainServiceKitCatalog.js` and are exposed at runtime through `engine.n.goldrushKitContracts`.
