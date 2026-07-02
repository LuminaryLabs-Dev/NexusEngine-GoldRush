# 048 Animation state graph

Status: planned
Phase: character-control-camera-and-staging
Domain: animation
Roadmap source: docs/aaa-production-roadmap/README.md

## Question
What has to be researched, specified, and proven so animation state graph can move GoldRush toward a 60-player high-fidelity wild-west extraction battle royale without breaking the kit-first architecture?

## Current Repo Evidence
- docs/aaa-production-roadmap/README.md
- .agent/audits/aaa-current-state-audit-2026-07-01.md
- .agent/audits/aaa-100-step-simulation-audit-2026-07-01.md
- docs/camera-perspective-catalog.md
- docs/current-playable-loop.md

## External References
- GitHub Game Engines collection for production surface gaps and modular game architecture patterns.
- Fortnite/Apex movement and squad-lobby readability references for character and camera feel.

## Domain Owner
`animation` owns this packet until implementation splits it into more specific kit or feature packets.

## Kit Impact
n:control:third-person-camera, n:control:character-movement, n:animation:state, and GoldRush player/presentation kits

## Atomic Substeps
- Define idle, walk, run, mine, carry, aim, shoot, hit, extract

## Data Contract
- Public data should expose only stable ids, status, snapshots, receipts, validation state, and player-facing cues required by other kits.
- Private/internal APIs should own heavy calculations, translation from source data, renderer placement, physics queries, networking fanout, and proof bookkeeping.
- Config should stay minimal: seed, ids, tuning defaults, feature flags, and explicit approval/provenance references where needed.

## Player-View Acceptance
- The player can understand the result without reading debug overlays.
- Foreground, midground, objective, route, threat, and reward cues remain readable in the relevant scene.
- If this packet touches motion, camera, animation, train, or interaction timing, screenshot proof is not enough; add a motion/video proof target.

## Edge Cases
- Restart with partial knowledge should land in a packet, not in chat-only memory.
- Public proof must not claim more than the validator or screenshot actually covers.
- Local reports must stay sanitized and avoid local machine paths, account data, raw asset paths, or runtime promotion claims.
- If this creates a too-large kit, split it by domain before implementation.

## Research Step
- Confirm current repo state for this packet.
- Compare against the external references above.
- Write the smallest domain-specific data contract.
- Define acceptance, edge cases, and validation before code.

## Simulation And Audit Gate
Every loop action has animation state

## Validation
Camera stability, player-loop readiness, browser movement screenshots, and motion video when diagnosing camera or animation.
