# Weapon Hit Feedback - Data Proof

Status: planned docs-only
Axis: 13
Source: Apex Legends official game modes
URL: https://help.ea.com/en/articles/apex-legends/game-modes/

## Data And Proof

- Data seed: weapon id, fire cue, hit result, target id, damage, recoil impulse, tracer/muzzle cue, receipt id..
- Event seed: weapon.fired, projectile.missed, projectile.hit, damage.applied, combat.receipt.recorded.
- Validator target: Input proof verifies one fire action creates one audio/visual/receipt bundle and no duplicate damage..
- Human-view proof: Record aim, fire, miss, hit, damage cue, target reaction, reload/cooldown, and receipt/results summary..
- Public proof must re-run after Build branch deploys.
