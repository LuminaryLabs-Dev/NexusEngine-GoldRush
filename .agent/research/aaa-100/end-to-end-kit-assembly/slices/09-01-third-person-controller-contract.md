# Third Person Controller - Contract

Status: planned docs-only
Slice: 09 Third Person Controller
Domain: control/camera/input
Scene/site: site.gold-field
Generic kit: n:control:third-person-camera plus n:control:character-movement
GoldRush kit: n:goldrush:exploration-camera plus n:goldrush:prospector-movement

## Purpose

Define the owner kit, domain boundary, public API, private API, snapshot, reset, and graduation boundary.

## Slice Intention

Make mouse-look and camera-relative WASD the only normal exploration control authority.

## Atomic Substeps

1. Confirm this slice is owned by `n:goldrush:exploration-camera plus n:goldrush:prospector-movement` and not by renderer-only logic.
2. Confirm the generic kit dependency remains neutral and promotable when applicable.
3. Define the smallest public API command or query the next slice needs.
4. Define the private work the kit may do behind the API.
5. Define the event payload emitted when the slice changes.
6. Define the serializable snapshot for browser and simulator proof.
7. Define reset behavior for scene changes, match restart, and failed proof.
8. Define the main negative fixture or fakeout case.
9. Define one human-view acceptance check when the slice is player-facing.
10. Define the next slice that consumes this output.

## Event And Snapshot

- Event: `controller.frame.resolved`
- Snapshot: `thirdPersonController`
- Reset rule: clear transient scene state, retain durable receipts only when the match lifecycle owns them.

## Validator Seed

`validate-third-person-controller plus live-state audit`

## Human-View Proof Seed

camera pose remains single-authority and movement follows camera yaw over multiple frames

## Known Fakeout

Movement works in one proof only because a helper teleports or directly places the player.

## Implementation Boundary

This is docs-only. Runtime code changes, new local kits, asset movement, deployment, and proof execution are deferred until implementation mode resumes.

