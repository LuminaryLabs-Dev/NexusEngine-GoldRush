# Mining Claim Pressure

Status: active

## Research Signal

- Extraction games work when loot creates visible stakes: entering, gathering, and escaping should make the player feel the value at risk, not just increment a hidden number.
- Progress feedback matters because the player needs to know what is happening during a hold action and how close they are to completion.
- Combat pressure must be readable before punishment. Threats need visual/audio tells, reaction windows, and counterplay.

## Sources

- Galaxy notes extraction games are evolving around accessibility and balanced risk/reward loops: https://www.galaxy.com/insights/perspectives/a-brief-roadmap-to-achieving-greater-adoption
- Nielsen Norman Group frames progress indicators as visibility of system status: https://www.nngroup.com/articles/progress-indicators/
- Game Developer breaks readability into telegraphing before an action and expectation after it: https://www.gamedeveloper.com/game-platforms/designing-for-difficulty-readability-in-arpgs

## GoldRush Gap

Mining currently pays gold, but the player-facing risk of working a claim is too implicit. A high-value seam should explain:

- expected payout.
- progress.
- depletion.
- noise radius.
- claim heat.
- next risk.
- receipt history.

## Kit Implication

`engine.n.goldrushExtractionLoop` should expose mining claim pressure through `n:goldrush:mine-hold-action`, not through renderer-only UI state.

## Validator Implication

`tools/validation/validate-goldrush-extraction-loop.mjs` should prove:

- `goldrush-mining-claim-pressure-v1` exists.
- mine markers carry site-level mining readability data.
- mine completion returns deterministic mining receipts.
- claim heat, noise radius, reward preview, and mined totals survive snapshots.
