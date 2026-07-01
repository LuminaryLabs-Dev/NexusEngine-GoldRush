# Gold Rush Scoring And Results Contract

## Purpose

Gold Rush scoring is owned by NexusRealtime kits, not by Three.js, DOM controls, or HUD code.

## Runtime APIs

- `engine.n.goldrushScoring`
- `engine.n.goldrushResults`

## Score Sources

- extraction receipts
- combat result receipts
- extraction-loop combat outcome summaries
- survival bonuses
- explicit penalties

Scores are deterministic, non-negative, and applied once per receipt ID.

## Results

`engine.n.goldrushResults.finalize()` produces:

- result ID
- final status
- end reason
- completed tick
- winner
- placements
- awards
- combat outcome summary
- final-rush pressure summary
- final audio and animation cue IDs

`goldrushResults` and `goldrushReplaySummary` expose `goldrush-final-rush-result-summary-v1`, including pressure-linked receipt count, highest pressure, average pressure, max multiplier, pressured gold-zone ids, and a readable collapse-pressure explanation for the result UI.

The current browser proof finalizes `team-01` after extraction, handoff, final rush pressure, and replay summary capture.

`npm run proof:final-rush-results` now proves the browser results screen can show a pressure-linked final-rush extraction with visible Rush/Pressure, Collapse explanation, Collapse Cashout award, and replay pressure while keeping raw `gold.zone.*`, threat, lane, and cashout-site IDs out of player-facing copy.

`npm run proof:combat-results` also rejects raw threat/lane IDs in visible replay copy while preserving those deterministic IDs in result and replay snapshots.

The final-rush and public smoke proofs also require result next-action buttons to be visible in the first viewport, so the post-run loop remains playable without scrolling.

`npm run proof:final-rush-results:mobile` runs the same result proof at `390x844` and additionally proves no horizontal overflow, no stat-value truncation, and visible result actions before the detailed panels.
