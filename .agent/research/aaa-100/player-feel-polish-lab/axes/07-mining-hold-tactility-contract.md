# Mining Hold Tactility - Contract

Status: planned docs-only
Axis: 07
Domain: gameplay/interaction/audio/vfx

## 10 Point Kit Contract

1. domainPath: n:gameplay:interaction-hold
2. purpose: Make mining feel like a physical timed action with progress, tool motion, sound, material response, and cancel rules.
3. publicApi: expose command/query functions for the smallest player-facing behavior only.
4. internalApi: keep implementation helpers private to the kit and do not let UI or renderer call them directly.
5. events: interaction.hold.started, interaction.hold.progressed, interaction.hold.cancelled, interaction.hold.completed.
6. snapshot: target id, hold ratio, cancel reason, tool phase, material cue, reward preview, exposure risk..
7. reset: clear transient action state, release authority, and preserve only durable config defaults.
8. dataExposed: target id, hold ratio, cancel reason, tool phase, material cue, reward preview, exposure risk..
9. validator: Input replay proves hold begins only in range, advances while pressed, cancels on movement/damage, and emits a receipt on completion.
10. graduationRule: generic behavior can graduate only if it has no GoldRush naming, no GoldRush rules, and complete validator/proof coverage.

## GoldRush Pair

- GoldRush kit: n:goldrush:mine-hold-action
- GoldRush responsibility: compose the generic surface into wild-west extraction gameplay and tune the player-readable behavior.
