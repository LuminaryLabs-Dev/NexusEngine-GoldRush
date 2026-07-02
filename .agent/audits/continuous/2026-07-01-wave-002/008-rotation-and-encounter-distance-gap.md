# Rotation And Encounter Distance Gap

Status: active docs-only

ID: 008
Domain: world/control/combat
Severity: high
Owner: n:goldrush:desert-world-map plus n:goldrush:combat-route-guidance
Roadmap rows informed: 029, 032, 050, 051, 052, 071, 074, 077

## Reference Observation

PUBG frames zone timing around rotations, engagement distances, and player density. GoldRush needs route corridors that support walking, cover, ambush, extraction, and late-game convergence.

## GoldRush Gap

Current movement and combat route guidance are promising, but authored routes and encounter distances are not yet map-owned.

## Kit Implications

- world map owns route corridors and sightline bands
- control kit owns camera-relative traversal
- combat route kit consumes authored cover instead of player-relative fallback cover

## Evidence Required Before Calling This Resolved

- route graph with travel times and encounter distances
- human-view proof of readable routes around central mountains
- combat route proof using authored cover anchors

## Edge Cases

- routes can be too flat, too direct, or too maze-like
- camera-relative movement must stay stable on slopes
- cover generated relative to player should be replaced by authored anchors

## Docs-Only Rule

This packet does not authorize runtime changes. It defines what the next implementation packet must prove before the gap can be marked resolved.
