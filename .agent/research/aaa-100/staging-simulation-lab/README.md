# Staging Simulation Lab

Status: active docs-only
Date: 2026-07-01
Domain: staging / bots / simulation / network / validation / release

## Purpose

Define the dedicated staging and simulation layer needed for GoldRush to be playable by one local tester while still moving toward honest 60-player battle-royale extraction readiness.

## Core Rule

Single-player proof, bot-fill proof, 20-player simulation, 60-player simulation, public browser proof, and future live multiplayer proof are different proof types. Reports must label them separately.

## Core Shape

```txt
practice mode
-> training yard
-> bot roster
-> dummy squads
-> 20-player dress rehearsal
-> 60-player scale harness
-> room partition load test
-> scenario seed library
-> simulator proof
-> browser human proof
-> public proof
-> restart packet
```

## Counts

- Staging scenarios: 18
- Packet types per scenario: 4
- Scenario packets: 72
- Paired research notes: 72

## Files

- `staging-scenario-matrix.md`
- `staging-research-matrix.md`
- `mode-taxonomy.md`
- `bot-roster-contract.md`
- `simulated-vs-live-proof-boundary.md`
- `nexus-simulator-proof-contract.md`
- `human-proof-gates.md`
- `release-readiness-gate.md`
- `fakeout-register.md`
- `scenarios/`
- `research/`

## First Implementation Direction

When implementation mode resumes, start with practice mode plus bot roster seeding before trying to claim 60-player readiness.

```txt
single-player practice
-> deterministic seed
-> one bot archetype
-> one resource route
-> one cashout route
-> one pressure event
-> one results receipt
-> local browser proof
```

Do not claim live multiplayer readiness from this packet. It is a staging runway and proof classifier.

