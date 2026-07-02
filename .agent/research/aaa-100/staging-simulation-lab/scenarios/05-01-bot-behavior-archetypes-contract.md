# Bot Behavior Archetypes - Contract

Status: planned docs-only
Scenario: 05 Bot Behavior Archetypes
Domain: combat/AI/staging
Owner kit: n:goldrush:bot-behavior-archetypes

## Purpose

Define owner kit, public API, private API, event, snapshot, reset, and stage boundary.

## Scenario Intention

Give bots simple roles such as prospector, ambusher, guard, runner, extractor, scout, and decoy.

## Atomic Substeps

1. Confirm the scenario owner is `n:goldrush:bot-behavior-archetypes`.
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

- Event: `bot.behavior.intent.changed`
- Snapshot: `botBehaviorArchetypes`
- Reset: clear transient bots, inputs, and scene setup; retain only sanitized scenario report and durable match receipts when owned by match kits.

## Validator Seed

`validate-bot-behavior-archetypes`

## Human Proof Seed

Human-view proof shows a bot pursuing a clear role with readable telegraph and counterplay.

## Fakeout To Prevent

Bots exist but only stand still, chase blindly, or deal hidden damage.

## Implementation Boundary

This is docs-only. Runtime kits, simulator commands, browser automation, network behavior, and deployment gates are deferred until implementation mode resumes.

