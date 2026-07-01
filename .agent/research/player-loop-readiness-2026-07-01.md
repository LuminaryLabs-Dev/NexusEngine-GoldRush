# Player Loop Readiness Matrix

Status: active

## Intent

Keep the GoldRush extraction loop from becoming a proof-script-only path. The game needs a durable player-facing readiness matrix that shows whether a human can understand and complete mine -> carry -> cashout -> results through current-objective cues, route guidance, visible cargo, hold actions, and receipt-backed scoring.

## Research Inputs

- Game Accessibility Guidelines calls out current objectives, in-game reminders, contextual help/guidance, clear interactive elements, and distinct sound/music choices as player-facing accessibility needs.
- Microsoft Xbox Accessibility Guideline 109 focuses on objective clarity and links current-objective reminder guidance as a relevant implementation resource.
- Microsoft Xbox Accessibility Guideline 104 frames important audio cues as information that should also be understandable without audio, which supports the readiness rule that cue state cannot rely on sound alone.

Sources:
- https://gameaccessibilityguidelines.com/full-list/
- https://learn.microsoft.com/en-us/gaming/accessibility/xbox-accessibility-guidelines/109
- https://learn.microsoft.com/en-us/xbox/accessibility/xbox-accessibility-guidelines/104

## Domain Decision

- Domain: `n:goldrush:player-loop-readiness`
- Runtime API: `engine.n.goldrushPlayerLoopReadiness`
- Contract: `goldrush-player-loop-readiness-v1`
- Inputs: `n:goldrush:player-driven-extraction-route`, `n:goldrush:player-route-guidance`, `n:goldrush:player-guidance-cue`, `n:goldrush:player-action-surface`, `n:goldrush:gold-carrying`, `n:goldrush:cashout-sites`, `n:match:receipts`, `n:match:results`
- Browser proof: `npm run proof:player-loop-readiness`

## AAA Gap Addressed

- Before: route, cue, cargo, cashout, and result proof existed as separate systems. A regression could pass one local check while breaking the human-view sequence.
- After: the game exposes a six-row matrix for resource cue, mine hold, cargo visual, cashout cue, cashout hold, and receipt-backed results. Each row has domain ownership, evidence, gaps, and validator/proof implications.

## Proof Policy

- The matrix tracks direct completion helper debt separately from route helper debt.
- The matrix treats placement-helper proof as prototype debt.
- Current objective visibility is a first-class proof policy row.
- Camera-relative route input must remain visible in the route guidance row.
- Audio can reinforce the route, but visual/readability proof must stand on its own.

## Kit Gaps

- Add richer high-fidelity cue geometry/materials without changing the readiness contract.
- Add accessibility settings for guidance cue scale, opacity, pulse reduction, and hold/toggle interaction.
- Add combat-pressure rows once the combat loop becomes more than a local ambush pressure marker.
- Add live peer/party variants of the matrix once multi-browser players participate in the same run loop.
