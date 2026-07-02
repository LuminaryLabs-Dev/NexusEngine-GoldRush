# AAA Current State Audit

Status: active
Date: 2026-07-01
Mode: docs-only, no runtime code changes

## Intention

GoldRush should become a high-fidelity, toon-shaded, wild-west extraction battle royale that supports 60-player play while retaining a single-player staging environment for testing. The architecture should stay kit-first and domain-based.

## Architecture

```txt
NexusRealtime runtime contract
|-- neutral local generic incubator kits
|-- GoldRush custom orchestration kits
|-- ProtoKit bridge for reusable route/cargo/extraction behavior
|-- Three.js renderer consuming descriptors
|-- Cannon terrain physics adapter
|-- asset/audio approval and promotion gates
`-- Playwright/NexusSimulator/validator proof surfaces
```

## Validator Evidence

| Command | Result |
| --- | --- |
| `node tools/validation/validate-reality-status.mjs` | `reality-status-ready`; 14 domains; 7 real local; 5 prototype; 2 blocked cloud; 47 placeholder slots; 0 promoted assets/audio/animations |
| `node tools/validation/validate-domain-kit-contracts.mjs` | 31 generic kits; 39 GoldRush kits; 31 pairings |
| `node tools/validation/validate-free-toon-candidates.mjs` | 2 packs; 16 model candidates; 6 audio candidates; runtime promotion false |
| `node tools/validation/validate-terrain-collider.mjs` | terrain collider passed |
| `node tools/validation/validate-physics-backend-kit.mjs` | active backend `cannon-es`; Rapier future adapter |
| `node tools/validation/validate-player-loop-readiness.mjs` | player loop readiness resolved |
| `node tools/validation/validate-combat-loop-readiness.mjs` | combat loop readiness resolved |
| `node tools/validation/validate-procedural-renderer-kits.mjs` | procedural renderer kits passed |

## Findings

### 1. The map is the main plateau

- Issue: The current procedural terrain proves scale, collider, placement, and movement, but it is not yet an authored world.
- Why it matters: Battle royale extraction games need map literacy: landmarks, lanes, danger, loot, cover, and extraction pressure.
- Long-term risk: More procedural clutter will make the world noisier without making it more playable.
- Hardening: Create an authored terrain source kit with height, biome, route, gold, cover, town, rail, and extraction masks.

### 2. Runtime assets are still unpromoted

- Issue: Reality status reports 0 promoted assets, 0 promoted audio, and 0 promoted animations.
- Why it matters: The visual/audio ceiling cannot rise without approved runtime assets or higher-fidelity local protokits.
- Long-term risk: Placeholder proof will keep passing while the game still feels unfinished.
- Hardening: Continue approval/promotion gates, and use free/toon candidates only as source candidates until approved.

### 3. Character and animation are still prototype-class

- Issue: Character rig and animation clips remain prototype in reality status.
- Why it matters: Over-the-shoulder third-person games depend on body readability, foot placement, knees, cargo posture, aiming, and mining animation.
- Long-term risk: Movement and interaction will feel fake even when systems are correct.
- Hardening: Define rig/animation state graph before adding more interaction complexity.

### 4. Combat is represented but not production-playable

- Issue: Combat readiness validates receipts and loop representation, but production combat needs weapon feel, cover rules, readable threats, and network constraints.
- Why it matters: The target is battle royale extraction, not only extraction with abstract pressure.
- Long-term risk: Combat becomes a scoreboard effect instead of a player skill loop.
- Hardening: Build combat mechanics around authored cover, threat readability, and receipt-backed weapon interactions.

### 5. Mining/extraction need tactile fidelity

- Issue: The player loop is resolved structurally, but mining/cashout still need stronger animation, audio, prop, and hold-feedback polish.
- Why it matters: Extraction games live on the tension of committing to a risky interaction.
- Long-term risk: The core loop will be technically true but emotionally flat.
- Hardening: Bind every interaction to object protokits, cue audio, animation state, cancel rules, and receipt output.

### 6. 60-player target needs staged proof

- Issue: Current local proof covers simulated topology and player-loop readiness, not a full live 60-player experience.
- Why it matters: Multiplayer scale changes data, performance, UI, and fairness constraints.
- Long-term risk: Systems that work for one browser fail at scale.
- Hardening: Build staging bots, NexusSimulator scenarios, and partition snapshots before real 60-player proof.

### 7. Current source control state is already noisy

- Issue: The worktree has pre-existing deleted Playwright scratch artifacts and untracked audit/screenshot reports.
- Why it matters: Broad docs and production work should not accidentally mix with scratch cleanup.
- Long-term risk: Good changes become hard to review.
- Hardening: Keep this docs pass isolated and do not revert unrelated pre-existing changes without user approval.

## Audit Rewrite

The project should stop trying to make the current procedural field look AAA by incremental scattering. The next durable production move is a map-source pipeline:

```txt
drawn map source
-> terrain mesh and LOD
-> collider and raycast placement
-> object protokit placement
-> interaction sites
-> combat/extraction proof
```

The current kit architecture is good enough to support that shift. The missing layer is authored content direction plus asset promotion, not another ad hoc renderer pass.
