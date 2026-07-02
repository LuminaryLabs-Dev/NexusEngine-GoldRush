# Validation CLI Contract

Status: active docs-only

Packet: 018
Domain: runtime
Target kit: n:runtime:validation
Roadmap atoms: 021, 022, 023, 024, 026, 040

## Purpose

Define the CLI proof expected before authored terrain code can be considered stable enough for player-facing browser proof.

## Why This Prevents Plateau

The game keeps plateauing when visual changes land without automated gates that prove the map, collider, placement, and loop still agree.

## Data Exposed

- validatorName
- fixtureId
- sourceRevisionHash
- consumerResults
- failureCategory
- sanitizedReportPath

## Public API Shape

- validateTerrainSource()
- validateTerrainConsumers()
- validateGoldRushMapLoop()
- writeSanitizedValidationReport()

## Events And Snapshot

- validationStarted
- validationPassed
- validationFailed

Snapshot must include the target kit, source revision, consumer revision, validation state, and enough domain state to debug without leaking machine-local paths.

## Validation And Proof

- validators fail closed on missing terrain source
- validators compare render/collider/placement/gameplay revisions
- report-secret validator passes after proof output

## Edge Cases And Stop Conditions

- Do not add one-off validators that cannot run in CI.
- Do not include local paths in retained reports.
- Stop if validation can pass with fallback flat terrain.

## Implementation Note

Do not code from this packet alone. Read the parent authored terrain spec, the matching atomic map packet, the matching four research packets, the implementation simulation, and the hardening audit before editing runtime files.
