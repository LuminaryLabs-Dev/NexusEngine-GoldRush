# Reward Risk Balance

Status: active docs-only

Atom ID: 007-04
Parent packet: 007 - Loot Economy And Loadout Gap
Domain: gameplay/content/progression
Owner: n:gameplay:cargo plus n:goldrush:economy

## Atomic Objective

Tie reward value to route risk, extraction distance, and pressure phase.

## Source Context

Battle royale readability depends on resources, equipment, and rewards; GoldRush should translate that into gold, tools, weapons, and extraction tokens.

## Data Contract Seed

reward id, risk tier, distance, phase modifier, expected value

## Event And Snapshot Seed

Event: rewardRiskEvaluated

Snapshot must include parent packet id, atom id, owner kit, source revision, readiness state, unresolved caveats, and sanitized proof labels.

## Validation Seed

simulation reports value distribution

## Research Pair

- research/007-04-reward-risk-balance-research.md

## Stop Condition

Stop implementation if this atom requires runtime behavior outside the named owner kit, bypasses validation, relies on unapproved assets, or lets a narrow local check imply broad AAA readiness.
