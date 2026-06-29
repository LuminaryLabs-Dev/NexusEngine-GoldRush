# Gold Rush Match Lifecycle Contract

## Purpose

The match lifecycle pass makes Gold Rush a complete local match arc without importing raw Unity assets or moving logic into the renderer.

```txt
lobby -> drop -> prospect -> combat -> finalRush -> collapse -> extract -> results
```

## Runtime APIs

- `engine.n.goldrushMatch`: match status, phase order, tick counter, player count, and end condition.
- `engine.n.goldrushFinalRush`: final rush warning, collapse pressure, locked gold zones, and pressured room windows.
- `engine.n.goldrushScenario`: thin orchestration over the dedicated lifecycle APIs.

## Scenario Helpers

- `generateMatch({ players, phase })`
- `startMatch({ players, seed, phase })`
- `triggerFinalRush()`
- `simulateExtraction({ playerId, goldAmount, cargoValue, receiptId })`
- `requestHandoff({ gateId, playerIds })`
- `endMatch({ reason })`

The scenario helper methods call dedicated kits. They do not directly own scoring, receipts, final results, or replay summaries.

## Validation Rules

- Match phase movement cannot go backward unless `restart()` is used.
- Final rush can arm once.
- Collapse pressure is deterministic, monotonic, and clamped between `0` and `1`.
- Results finalize once.
- Renderer and DOM are not required for lifecycle validation.

## Browser Proof

The browser HUD exposes match phase, pressure, extracted gold, leader score, receipt counts, result status, replay moments, world scale, patch count, and kit count. The renderer only draws snapshot state.

