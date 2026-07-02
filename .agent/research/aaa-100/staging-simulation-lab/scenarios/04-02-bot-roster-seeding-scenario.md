# Bot Roster Seeding - Scenario

Status: planned docs-only
Scenario: 04 Bot Roster Seeding
Domain: staging/bots
Owner kit: n:goldrush:bot-roster-seeding

## Purpose

Define the deterministic setup, player route, bot or scale condition, and expected receipts.

## Scenario Intention

Create deterministic bot squads, archetypes, spawn positions, team ids, and difficulty bands for staging.

## Atomic Substeps

1. Confirm the scenario owner is `n:goldrush:bot-roster-seeding`.
2. Confirm whether the scenario is practice, bot fill, scale simulation, browser proof, public proof, or future live network proof.
3. Define the public API call or scenario seed needed to start it.
4. Define the private setup allowed before the player route begins.
5. Define the event emitted when the scenario state changes.
6. Define the snapshot required for validator and browser proof.
7. Define the receipts that should survive scenario reset or match end.
8. Define the fakeout that must fail validation.
9. Define the human-view evidence required if the player sees or feels this scenario.
10. Define the restart packet that should be written if this scenario fails.

## Event And Snapshot

- Event: `bot.roster.seeded`
- Snapshot: `botRosterSeeding`
- Reset: clear transient bots, inputs, and scene setup; retain only sanitized scenario report and durable match receipts when owned by match kits.

## Validator Seed

`validate-bot-roster-seeding`

## Human Proof Seed

Scenario report shows named bot squads and browser proof shows at least one readable bot/threat presence.

## Fakeout To Prevent

Bot count is a number in state but bots have no spawn, team, behavior, or receipt identity.

## Implementation Boundary

This is docs-only. Runtime kits, simulator commands, browser automation, network behavior, and deployment gates are deferred until implementation mode resumes.

