# Character Rig Body Readability - Contract

Status: planned docs-only
Axis: 05
Domain: character/render

## 10 Point Kit Contract

1. domainPath: n:animation:rig-readability
2. purpose: Replace placeholder body language with a readable toon western character that has knees, joints, gear, and silhouette.
3. publicApi: expose command/query functions for the smallest player-facing behavior only.
4. internalApi: keep implementation helpers private to the kit and do not let UI or renderer call them directly.
5. events: rig.loaded, rig.socket.bound, rig.readability.failed, rig.asset.pending.
6. snapshot: rig id, skeleton/joint map, silhouette role, gear sockets, knee joints, hand targets, carried item sockets..
7. reset: clear transient action state, release authority, and preserve only durable config defaults.
8. dataExposed: rig id, skeleton/joint map, silhouette role, gear sockets, knee joints, hand targets, carried item sockets..
9. validator: Static and motion screenshots prove knees, arms, carried cargo, hat, tool, and body orientation are visible.
10. graduationRule: generic behavior can graduate only if it has no GoldRush naming, no GoldRush rules, and complete validator/proof coverage.

## GoldRush Pair

- GoldRush kit: n:goldrush:prospector-rig
- GoldRush responsibility: compose the generic surface into wild-west extraction gameplay and tune the player-readable behavior.
