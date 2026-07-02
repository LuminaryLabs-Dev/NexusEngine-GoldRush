# NexusSimulator Proof Contract

Status: active docs-only

## Purpose

Define how the simulator should support GoldRush without replacing human-view proof.

## Simulator May

- load deterministic scenario seeds.
- tick runtime phases.
- simulate bot rosters.
- sample 20-player and 60-player state budgets.
- inspect events and snapshots.
- assert receipt consistency.
- run negative fakeout fixtures.

## Simulator Must Not

- claim live player readiness.
- bypass player-facing actions without labeling setup-only commands.
- mutate approval or runtime asset state.
- use hidden browser globals as proof.
- replace screenshots for visible features.

