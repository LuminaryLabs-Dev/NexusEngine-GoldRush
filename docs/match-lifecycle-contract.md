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

The browser flow must expose the full local loop: title, lobby, loading-yard train, gold field, extraction, and results. The results screen presents `goldrushResults` and `goldrushReplaySummary` snapshots: placement, winner, score, extracted gold, frontier condition, extraction contest severity, combat outcome summary, awards, and replay moments. The DOM does not calculate scoring or replay facts.

Combat result visibility is proven through:

```bash
npm run proof:combat-results -- --url http://127.0.0.1:5177/NexusEngine-GoldRush/
```
