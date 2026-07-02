# 17 Simulation Reporting

Status: planned

## Purpose

Write sanitized reports that label bot, simulated, local, public, and live proof boundaries.

## Player Need

Developers should know what was actually tested before making release or design claims.

## Owning Kits

- Generic incubator candidate: `n:runtime:simulation-proof`
- GoldRush custom kit: `n:goldrush:bot-simulation-reporting`

## Public API Seed

- `startSimulationReport(runId)`
- `recordSimulationFact(fact)`
- `finalizeSimulationReport()`

## Internal API Seed

- `sanitizeReport(report)`
- `scoreCoverage(report)`
- `attachProofLabels(report)`

## Events

- `simulation.report.started`
- `simulation.fact.recorded`
- `simulation.report.finalized`

## Snapshot

- `runId`
- `coverage`
- `proofTier`
- `fakeoutFlags`
- `sanitized`

## Validator

`validate-bot-simulation-reporting.mjs`

## Player-View Proof

Reports pass secret/path hygiene and label bot-fill, public smoke, local smoke, simulator, and future live proof separately.

## Risk If Missing

Unsanitized or mislabeled reports will create security risk and false completion claims.
