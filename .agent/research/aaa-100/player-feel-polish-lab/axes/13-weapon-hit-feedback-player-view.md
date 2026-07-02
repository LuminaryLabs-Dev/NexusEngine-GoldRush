# Weapon Hit Feedback - Player View

Status: planned docs-only
Axis: 13
Domain: combat/audio/vfx/receipts

## Player Need

The player should know whether a shot fired, missed, hit, damaged, downed, or forced retreat.

## Acceptance

- The player can tell what changed without opening debug state.
- The player can tell what to do next.
- The cue works from the over-the-shoulder camera.
- The cue survives scene transition or clearly resets during transition.
- The cue does not crowd out higher-priority world information.

## Proof

Record aim, fire, miss, hit, damage cue, target reaction, reload/cooldown, and receipt/results summary.
