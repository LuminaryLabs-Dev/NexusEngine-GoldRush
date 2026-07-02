# Progression Replay And Retention Gap

Status: active docs-only

ID: 010
Domain: match/progression/product
Severity: medium
Owner: n:match:results plus n:match:replay-summary plus n:goldrush:progression
Roadmap rows informed: 067, 068, 069, 093, 098

## Reference Observation

Modern service games turn each match into a memory and a reason to return through summaries, progress, rewards, events, and readable identity. GoldRush results need to become more than score text.

## GoldRush Gap

Results and replay summary exist, but long-term progression, unlocked cosmetics/tools, run history, and player learning are not yet domain-owned.

## Kit Implications

- results owns match outcome
- replay owns key moments
- progression owns persistent unlock rules
- save/load owns durable local state when allowed

## Evidence Required Before Calling This Resolved

- replay digest that explains why the run succeeded or failed
- progression packet separating cosmetic, tool, and meta rewards
- sanitized save/load proof before persistence claims

## Edge Cases

- do not add grind before core loop is fun
- do not persist sensitive or unstable debug state
- do not make results too dense for first viewport

## Docs-Only Rule

This packet does not authorize runtime changes. It defines what the next implementation packet must prove before the gap can be marked resolved.
