# Accessibility And Control Comfort - Contract

Status: planned docs-only
Axis: 17
Domain: control/ux/accessibility

## 10 Point Kit Contract

1. domainPath: n:control:input-comfort
2. purpose: Make the player loop usable across mouse sensitivity, hold duration, motion comfort, contrast, and audio preferences.
3. publicApi: expose command/query functions for the smallest player-facing behavior only.
4. internalApi: keep implementation helpers private to the kit and do not let UI or renderer call them directly.
5. events: comfort.setting.changed, input.device.changed, prompt.mode.changed, accessibility.warning.raised.
6. snapshot: sensitivity, invert, hold toggle, cue contrast, caption state, motion smoothing, volume groups, input device..
7. reset: clear transient action state, release authority, and preserve only durable config defaults.
8. dataExposed: sensitivity, invert, hold toggle, cue contrast, caption state, motion smoothing, volume groups, input device..
9. validator: Settings proof verifies each comfort setting changes runtime behavior and survives scene transitions.
10. graduationRule: generic behavior can graduate only if it has no GoldRush naming, no GoldRush rules, and complete validator/proof coverage.

## GoldRush Pair

- GoldRush kit: n:goldrush:control-comfort
- GoldRush responsibility: compose the generic surface into wild-west extraction gameplay and tune the player-readable behavior.
