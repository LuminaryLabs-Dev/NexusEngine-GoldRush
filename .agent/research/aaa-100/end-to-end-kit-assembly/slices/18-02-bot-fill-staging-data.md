# Bot Fill Single Player Staging - Data

Status: planned docs-only
Slice: 18 Bot Fill Single Player Staging
Domain: staging/combat/network
Scene/site: staging
Generic kit: n:match:lifecycle plus n:network:room-partitions
GoldRush kit: n:goldrush:bot-fill-staging

## Purpose

Define the minimal serializable data and event payloads needed for the slice to compose with adjacent kits.

## Slice Intention

Let one local player test the full 60-player-intended loop with bots, dummy squads, and deterministic scenarios.

## Atomic Substeps

1. Confirm this slice is owned by `n:goldrush:bot-fill-staging` and not by renderer-only logic.
2. Confirm the generic kit dependency remains neutral and promotable when applicable.
3. Define the smallest public API command or query the next slice needs.
4. Define the private work the kit may do behind the API.
5. Define the event payload emitted when the slice changes.
6. Define the serializable snapshot for browser and simulator proof.
7. Define reset behavior for scene changes, match restart, and failed proof.
8. Define the main negative fixture or fakeout case.
9. Define one human-view acceptance check when the slice is player-facing.
10. Define the next slice that consumes this output.

## Event And Snapshot

- Event: `staging.bot.roster.changed`
- Snapshot: `botFillStaging`
- Reset rule: clear transient scene state, retain durable receipts only when the match lifecycle owns them.

## Validator Seed

`validate-staging-scenarios plus NexusSimulator suite`

## Human-View Proof Seed

single-player scenario can run full loop with bot pressure, receipt output, and no claim of live multiplayer proof

## Known Fakeout

A solo proof is described as multiplayer readiness without bot roster, scenario, or scale evidence.

## Implementation Boundary

This is docs-only. Runtime code changes, new local kits, asset movement, deployment, and proof execution are deferred until implementation mode resumes.

