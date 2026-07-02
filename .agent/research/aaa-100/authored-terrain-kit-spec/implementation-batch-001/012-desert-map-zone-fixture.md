# Desert Map Zone Fixture

Status: active docs-only

Packet: 012
Domain: gameplay
Target kit: n:goldrush:desert-world-map
Roadmap atoms: 021, 023, 040

## Purpose

Define GoldRush-specific zones on top of the neutral authored terrain source: towns, mines, rails, gold, extraction, combat, and staging.

## Why This Prevents Plateau

The world stops improving when gold, towns, extraction, and combat are decorative instead of authored into one playable route web.

## Data Exposed

- zoneId
- zoneClass
- bounds
- sourceMasks
- routeLinks
- riskTier
- rewardTier
- consumerKits

## Public API Shape

- listZonesByClass(className)
- getZoneAt(point)
- getRouteLinks(zoneId)
- getZoneSnapshot()

## Events And Snapshot

- desertZoneLoaded
- desertZoneEntered
- desertZoneRouteLinked

Snapshot must include the target kit, source revision, consumer revision, validation state, and enough domain state to debug without leaking machine-local paths.

## Validation And Proof

- CLI validates every zone has terrain masks and route links
- human-view proof checks the player can identify destination value from ground level

## Edge Cases And Stop Conditions

- Keep GoldRush zone rules out of the neutral terrain kit.
- Do not place extraction without approach and counterplay space.
- Stop if zone graph strands player away from loop progression.

## Implementation Note

Do not code from this packet alone. Read the parent authored terrain spec, the matching atomic map packet, the matching four research packets, the implementation simulation, and the hardening audit before editing runtime files.
