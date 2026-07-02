# Zone Pressure Pacing Gap

Status: active docs-only

ID: 004
Domain: battle royale/match/gameplay
Severity: critical
Owner: n:gameplay:combat-pressure plus n:goldrush:final-rush-pressure
Roadmap rows informed: 016, 061, 070, 077, 087, 088, 089

## Reference Observation

PUBG describes zone pressure as a system that shapes movement, positioning, combat timing, survivor flow, and risk choices. GoldRush should treat final rush and frontier pressure as pacing systems, not just visual warnings.

## GoldRush Gap

GoldRush has final rush and ambush pressure receipts, but it needs a phase-by-phase pacing model tied to player density, gold greed, extraction timing, and combat routes.

## Kit Implications

- match lifecycle owns phase timing
- combat pressure owns threat calls
- extraction owns risk/value timing
- world map owns safe and risky route corridors

## Evidence Required Before Calling This Resolved

- simulated 60-player phase report with survivor density targets
- zone pressure snapshot tied to route guidance
- human-view proof that pressure changes player decisions

## Edge Cases

- zone pressure that only deals damage becomes arbitrary
- too much pressure deletes extraction choices
- too little pressure leaves the map stagnant

## Docs-Only Rule

This packet does not authorize runtime changes. It defines what the next implementation packet must prove before the gap can be marked resolved.
