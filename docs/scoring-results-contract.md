# Gold Rush Scoring And Results Contract

## Purpose

Gold Rush scoring is owned by NexusRealtime kits, not by Three.js, DOM controls, or HUD code.

## Runtime APIs

- `engine.n.goldrushScoring`
- `engine.n.goldrushResults`

## Score Sources

- extraction receipts
- combat result receipts
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
- final audio and animation cue IDs

The current browser proof finalizes `team-01` after extraction, handoff, final rush pressure, and replay summary capture.

