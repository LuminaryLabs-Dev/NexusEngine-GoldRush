# Simulation Reporting Data Proof

Status: planned

## Data Seed

- `runId`
- `coverage`
- `proofTier`
- `fakeoutFlags`
- `sanitized`

## Event Seed

- `simulation.report.started`
- `simulation.fact.recorded`
- `simulation.report.finalized`

## Proof Seed

- Validator: `validate-bot-simulation-reporting.mjs`
- Browser state: snapshot visible through existing runtime state inspection later.
- Human-view: Reports pass secret/path hygiene and label bot-fill, public smoke, local smoke, simulator, and future live proof separately.
- Report: mode id, proof tier, human count, bot count, fakeout flags.

## Acceptance

The proof passes only when the data surface can explain what the player sees and the player view can explain the data.
