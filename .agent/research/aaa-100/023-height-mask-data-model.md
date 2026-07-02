# 023 Height/mask data model

Status: active
Phase: authored-terrain-and-map-production
Domain: world
Roadmap source: docs/aaa-production-roadmap/README.md

## Question
What has to be researched, specified, and proven so height/mask data model can move GoldRush toward a 60-player high-fidelity wild-west extraction battle royale without breaking the kit-first architecture?

## Current Repo Evidence
- docs/aaa-production-roadmap/README.md
- .agent/audits/aaa-current-state-audit-2026-07-01.md
- .agent/audits/aaa-100-step-simulation-audit-2026-07-01.md
- docs/terrain-collider.md
- docs/object-micro-kit-generator.md

## External References
- GitHub Game Engines collection for production surface gaps and modular game architecture patterns.
- PUBG map/training/blue-zone framing and Fortnite traversal/cover readability for authored map planning.

## Domain Owner
`world` owns this packet until implementation splits it into more specific kit or feature packets.

## Kit Impact
n:goldrush:authored-desert-map plus terrain, collider, placement, route, and extraction-site kits

## Atomic Substeps
- Define height channels
- define biome masks
- define gameplay masks

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
Visual and gameplay use same data

## Validation
Terrain collider, terrain continuity, Playwright spawn/movement screenshots, and future LOD seam checks.

## Child Packet Expansion
- Folder: .agent/research/aaa-100/023-height-mask-data-model/
- Index: .agent/research/aaa-100/023-height-mask-data-model/README.md
- Child packets: intent, current evidence, reference research, data contract, player view, edge cases, validation, and deploy risk.
