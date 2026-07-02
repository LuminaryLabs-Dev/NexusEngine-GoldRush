# Weapon Hit Feedback - Contract

Status: planned docs-only
Axis: 13
Domain: combat/audio/vfx/receipts

## 10 Point Kit Contract

1. domainPath: n:combat:hit-feedback
2. purpose: Make shots, hits, misses, damage, armor/health, and receipts readable without relying on debug state.
3. publicApi: expose command/query functions for the smallest player-facing behavior only.
4. internalApi: keep implementation helpers private to the kit and do not let UI or renderer call them directly.
5. events: weapon.fired, projectile.missed, projectile.hit, damage.applied, combat.receipt.recorded.
6. snapshot: weapon id, fire cue, hit result, target id, damage, recoil impulse, tracer/muzzle cue, receipt id..
7. reset: clear transient action state, release authority, and preserve only durable config defaults.
8. dataExposed: weapon id, fire cue, hit result, target id, damage, recoil impulse, tracer/muzzle cue, receipt id..
9. validator: Input proof verifies one fire action creates one audio/visual/receipt bundle and no duplicate damage.
10. graduationRule: generic behavior can graduate only if it has no GoldRush naming, no GoldRush rules, and complete validator/proof coverage.

## GoldRush Pair

- GoldRush kit: n:goldrush:western-weapon-feedback
- GoldRush responsibility: compose the generic surface into wild-west extraction gameplay and tune the player-readable behavior.
