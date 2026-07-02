# Resource Object Readability - Contract

Status: planned docs-only
Axis: 09
Domain: content/render/gameplay

## 10 Point Kit Contract

1. domainPath: n:render:micro-object-instancing
2. purpose: Make mineable resources look distinct from generic rocks, clutter, and terrain seams.
3. publicApi: expose command/query functions for the smallest player-facing behavior only.
4. internalApi: keep implementation helpers private to the kit and do not let UI or renderer call them directly.
5. events: resource.spawned, resource.selected, resource.depleted, resource.readability.failed.
6. snapshot: object protokit id, visual form, gold value, placement mask, affordance range, selected state, depletion state..
7. reset: clear transient action state, release authority, and preserve only durable config defaults.
8. dataExposed: object protokit id, visual form, gold value, placement mask, affordance range, selected state, depletion state..
9. validator: Human-view screenshot proves mineable objects are identifiable without debug overlays.
10. graduationRule: generic behavior can graduate only if it has no GoldRush naming, no GoldRush rules, and complete validator/proof coverage.

## GoldRush Pair

- GoldRush kit: n:goldrush:resource-object-protokits
- GoldRush responsibility: compose the generic surface into wild-west extraction gameplay and tune the player-readable behavior.
