# Staging And Bot Proof Gap

Status: active docs-only

ID: 009
Domain: staging/validation/network
Severity: critical
Owner: n:goldrush:single-player-staging plus n:runtime:validation
Roadmap rows informed: 055, 084, 086, 087, 088, 089, 091, 094

## Reference Observation

Live battle royale games validate with changing player behavior, matchmaking, and public proof. GoldRush needs a single-player staging environment that can stand in for 60-player pressure without lying about live multiplayer.

## GoldRush Gap

Proof is currently strong for local/public loop slices, but staging bots need to exercise map traversal, mining, cashout, combat, pressure, and results at scale.

## Kit Implications

- single-player staging kit owns bots and scripted roles
- scenario runner owns repeatable timelines
- validation owns metrics and sanitized reports
- network kit labels simulated vs live participants

## Evidence Required Before Calling This Resolved

- bot-fill smoke with at least 20 simulated roles first
- deterministic report of route, combat, extraction, and survivor flow
- public proof labels staging mode clearly

## Edge Cases

- bots that stand still do not prove battle royale pacing
- simulated scale can hide network defects
- staging mode must not leak into normal player UX

## Docs-Only Rule

This packet does not authorize runtime changes. It defines what the next implementation packet must prove before the gap can be marked resolved.
