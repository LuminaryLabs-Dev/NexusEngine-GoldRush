# Massive Map POI Readability Gap

Status: active docs-only

ID: 003
Domain: world/art/render
Severity: critical
Owner: n:goldrush:desert-world-map plus n:render:terrain-bands
Roadmap rows informed: 021, 022, 028, 029, 031, 032, 033, 096

## Reference Observation

Apex frames maps as massive landscapes and PUBG frames positional decisions as central to battle royale flow. GoldRush needs a map with readable towns, mine sites, rails, mountains, washes, extraction sites, and combat lanes.

## GoldRush Gap

The current world can show terrain and props, but the authored terrain source must define landmark hierarchy and route readability from player height.

## Kit Implications

- map source owns POI masks and route links
- renderer consumes landmarks but does not invent them
- prop protokits fill authored anchors instead of random scatter

## Evidence Required Before Calling This Resolved

- top-down source plate with named POIs
- ground-level screenshot set for near, mid, far landmarks
- validator for every POI having masks, anchors, and route links

## Edge Cases

- large terrain without POI language feels empty
- dense props without hierarchy feel noisy
- mountains can block but must not hide the playable loop

## Docs-Only Rule

This packet does not authorize runtime changes. It defines what the next implementation packet must prove before the gap can be marked resolved.
