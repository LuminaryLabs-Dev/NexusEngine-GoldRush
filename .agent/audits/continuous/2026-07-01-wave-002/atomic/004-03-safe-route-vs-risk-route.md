# Safe Route Vs Risk Route

Status: active docs-only

Atom ID: 004-03
Parent packet: 004 - Zone Pressure Pacing Gap
Domain: battle royale/match/gameplay
Owner: n:gameplay:combat-pressure plus n:goldrush:final-rush-pressure

## Atomic Objective

Differentiate safe long routes and risky short routes through authored map data.

## Source Context

PUBG describes zone pressure as pacing movement, positioning, combat, survivor flow, and risk choices; GoldRush needs pressure to shape extraction decisions.

## Data Contract Seed

route id, risk tier, pressure exposure, cover count, reward link

## Event And Snapshot Seed

Event: routeRiskClassified

Snapshot must include parent packet id, atom id, owner kit, source revision, readiness state, unresolved caveats, and sanitized proof labels.

## Validation Seed

route validator sees both route types

## Research Pair

- research/004-03-safe-route-vs-risk-route-research.md

## Stop Condition

Stop implementation if this atom requires runtime behavior outside the named owner kit, bypasses validation, relies on unapproved assets, or lets a narrow local check imply broad AAA readiness.
