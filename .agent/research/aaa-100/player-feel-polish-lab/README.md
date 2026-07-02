# Player Feel Polish Lab

Status: active docs-only
Date: 2026-07-01
Domain: control / character / animation / audio / VFX / gameplay / validation

## Purpose

This packet set closes the current planning gap between a structurally working GoldRush loop and a player-readable AAA loop. The repo already has packets for authored terrain, asset families, promotion gates, staging, and end-to-end kit assembly. This lab focuses on the tactile layer: how the game feels in the hands, how the body responds, how sound and VFX confirm actions, and how local/public proof prevents fake progress.

## Core Diagnosis

The project can plateau even after kit architecture, terrain plans, and loop receipts exist because the player may still experience the build as flat, floaty, silent, stiff, or proof-driven instead of game-driven.

The missing layer is not one feature. It is a cross-domain polish contract:

```txt
input -> camera -> body -> terrain -> object -> action -> feedback -> receipt -> payoff -> proof
```

Each part must be domain-owned, event-backed, snapshot-visible, and player-readable.

## Reference Signals

- Apex Legends official game modes: https://help.ea.com/en/articles/apex-legends/game-modes/
  - Signal: Separates competitive Core from relaxed Freestyle, includes Bot Royale Evolved, private matches up to 60 players, Training, and Firing Range. GoldRush should likewise separate public claims, staging, bot fill, and practice proof instead of treating one proof as all modes.
- PUBG official game overview: https://pubg.com/en/game-info/overview
  - Signal: Frames battle royale as land, loot, survive with 100-player scale, shrinking space pressure, supply risk, vehicles, solo/duo/squad modes, and training. GoldRush needs readable phase language, route stakes, and practice surfaces.
- GitHub game engine collection: https://github.com/collections/game-engines
  - Signal: The collection highlights engines as multi-platform game frameworks. GoldRush should not become a general engine, but its local kits still need engine-like surfaces: render, input, audio, physics, tooling, validation, content, and release gates.
- GitHub JavaScript game engine collection: https://github.com/collections/javascript-game-engines
  - Signal: Browser games still need mature runtime concerns: rendering, interaction, asset pipelines, and proof. GoldRush should keep those as local kits and validators rather than renderer-only one-offs.

## Axes

- 01 Camera Mouse Look Feel: Make mouse look feel stable, intentional, and playable over the shoulder.
- 02 Camera Authority Stability: Prevent two systems from moving the gameplay camera in the same frame.
- 03 WASD Locomotion Feel: Make movement follow camera look direction with acceleration, stopping, and slope behavior that feel intentional.
- 04 Terrain Footing Grounding Feel: Make the player stand on visible terrain with believable slope and step behavior.
- 05 Character Rig Body Readability: Replace placeholder body language with a readable toon western character that has knees, joints, gear, and silhouette.
- 06 Locomotion Animation Blend: Tie locomotion states to motion so walk, run, strafe, carry, mine, and combat do not look detached.
- 07 Mining Hold Tactility: Make mining feel like a physical timed action with progress, tool motion, sound, material response, and cancel rules.
- 08 Cargo Weight Feedback: Make carried gold visibly and mechanically change movement, posture, sound, and threat exposure.
- 09 Resource Object Readability: Make mineable resources look distinct from generic rocks, clutter, and terrain seams.
- 10 Cashout Tension Feedback: Turn extraction from a completion helper into a readable, risky, timed destination.
- 11 Threat Telegraph Readability: Make danger readable before damage through sound, silhouette, direction, world cues, and pressure state.
- 12 Cover And Combat Counterplay: Make cover objects, terrain blockers, and threat routes create real choices instead of decorative clutter.
- 13 Weapon Hit Feedback: Make shots, hits, misses, damage, armor/health, and receipts readable without relying on debug state.
- 14 Audio Cue Layering: Replace hum/debug sound with layered title, lobby, train, movement, mining, cargo, threat, cashout, and result cues.
- 15 VFX And Diegetic Cues: Move guidance from debug overlays to in-world cues that explain route, action, danger, value, and extraction.
- 16 Results Payoff Readability: Make extracted gold, combat risk, route choices, frontier condition, and replay moments feel earned.
- 17 Accessibility And Control Comfort: Make the player loop usable across mouse sensitivity, hold duration, motion comfort, contrast, and audio preferences.
- 18 Local Public Human View Proof: Make every polish claim prove itself in local and public player view, with video when motion is judged.

## Files

- `feel-axis-matrix.md`
- `feel-research-matrix.md`
- `motion-proof-policy.md`
- `feedback-layer-contract.md`
- `readability-fakeout-register.md`
- `human-view-acceptance-gates.md`
- `validator-proof-plan.md`
- `restart-policy.md`
- `kit-gap-register.md`
- `axes/`
- `research/`

## Non-Code Rule

Do not implement from this lab until the user explicitly resumes code work. When implementation resumes, choose one axis, create or update the owning local GoldRush kit, run the validator, then run human-view proof if the result is visible or motion-based.
