# Pressure Feedback Layer

Status: active docs-only

Atom ID: 004-05
Parent packet: 004 - Zone Pressure Pacing Gap
Domain: battle royale/match/gameplay
Owner: n:gameplay:combat-pressure plus n:goldrush:final-rush-pressure

## Atomic Objective

Make pressure readable through world, audio, UI-minimal, and route cues.

## Source Context

PUBG describes zone pressure as pacing movement, positioning, combat, survivor flow, and risk choices; GoldRush needs pressure to shape extraction decisions.

## Data Contract Seed

cue role, audio cue, visual cue, route cue, urgency text

## Event And Snapshot Seed

Event: pressureFeedbackEmitted

Snapshot must include parent packet id, atom id, owner kit, source revision, readiness state, unresolved caveats, and sanitized proof labels.

## Validation Seed

human-view proof shows pressure without debug overlay

## Research Pair

- research/004-05-pressure-feedback-layer-research.md

## Stop Condition

Stop implementation if this atom requires runtime behavior outside the named owner kit, bypasses validation, relies on unapproved assets, or lets a narrow local check imply broad AAA readiness.
