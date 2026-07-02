# Live Ops Versioning And Restart Gap

Status: active docs-only

ID: 012
Domain: release/governance/runtime
Severity: high
Owner: n:runtime:snapshot plus agent-it workspace plus Build deployment
Roadmap rows informed: 001, 003, 004, 007, 010, 092, 095, 099, 100

## Reference Observation

Long-running battle royale games evolve through seasons, updates, patches, and deploy discipline. GoldRush needs restart packets, versioned source revisions, deploy proofs, and change logs to avoid losing direction across turns.

## GoldRush Gap

The repo has strong docs and proof conventions, but the untracked planning layer, dirty Playwright deletions, and public/local proof drift can still make restart state ambiguous.

## Kit Implications

- runtime snapshot owns version and source revision
- agent-it owns durable restart context
- Build workflow owns public deploy proof
- validation owns report hygiene

## Evidence Required Before Calling This Resolved

- restart packet links latest roadmap, simulations, audits, and proofs
- change log records durable docs-only waves
- sanitized report validation passes after docs/proof changes

## Edge Cases

- untracked docs can be lost before merge
- dirty scratch proof deletions should not be confused with game changes
- public proof must be tied to commit and terrain/source revision

## Docs-Only Rule

This packet does not authorize runtime changes. It defines what the next implementation packet must prove before the gap can be marked resolved.
