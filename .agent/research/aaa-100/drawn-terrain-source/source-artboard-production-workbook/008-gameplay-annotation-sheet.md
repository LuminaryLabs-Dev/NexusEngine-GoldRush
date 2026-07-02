# Gameplay Annotation Sheet

Status: active docs-only

## Purpose

Convert the source artboard into playable extraction battle-royale space.

## Required Annotations

| Annotation | Consumer | Purpose |
| --- | --- | --- |
| `spawnRoute` | scene flow, bots, proof | establish first movement |
| `mineRoute` | guidance, bots | route to first claim |
| `goldValueBand` | economy, scoring | risk/reward placement |
| `carryRoute` | guidance, ambush pressure | make cargo travel legible |
| `coverLane` | combat, bots, renderer | fair counterplay |
| `cashoutApproach` | extraction loop | define tension before deposit |
| `trainCorridor` | first sequence | keep train path coherent |
| `botPatrol` | staging | exercise solo test space |
| `finalRushPressure` | battle royale | compress late match routes |
| `proofRoute` | validation | deterministic local/public test path |

## Design Rule

Every gameplay annotation should be visible or inferable from the world. If it only exists as a receipt or debug state, it is not yet player-facing AAA design.

## 60-Player Note

The annotation sheet must separate live 60-player readiness from solo or simulated staging. Shared source annotations can support both, but proof labels must not blur them.
