# AAA Continuous Audit Index

Status: active

## Purpose

Define the continuous audit loop for the 100-step GoldRush roadmap. This is the operating index for future turns after implementation resumes.

## Audit Loop

1. Read `.agent/version-rebuild-loop/current-version.md` and the newest version packet.
2. Audit the newest version for working, partial, fake/helper-only, broken, missing, stale, and bad-assumption areas.
3. Decide whether this turn continues the newest version or increments to a new ground-up rebuild attempt.
4. Pick one packet from `.agent/research/aaa-100/data-matrix.md`.
5. Read the matching implementation simulation from `.agent/simulations/aaa-100/`.
6. Read the matching hardening audit from `.agent/audits/aaa-100-step-audits/`.
7. If the packet is part of the authored-map cluster, pick one atomic packet from `authored-map-atomic-matrix.md`.
8. Read that atom's four research packets from `authored-map-atomic-research-matrix.md`.
9. Re-read current repo evidence and latest validators before implementation.
10. Confirm the owning domain and target kit.
11. Implement only inside `NexusEngine-GoldRush` and only when implementation is allowed.
12. Run the closest validator and, when player-facing, human-view proof.
13. Update the version packet, packet state, and matrix row.
14. Update `lessons-matrix.md` only if a durable lesson or resolved boundary changed.
15. Add a change-log line.

## Edge-Case Families

| Family | What to look for |
| --- | --- |
| Map source drift | Visual terrain, collider, route masks, object placement, and extraction zones diverge. |
| Asset approval drift | Raw or sanitized assets get treated as runtime assets without approval. |
| Camera authority drift | More than one system moves the gameplay camera per frame. |
| Interaction fakeout | A receipt proves state, but the player did not perform a readable action. |
| 60-player fakeout | Single-browser proof is described as live multiplayer proof. |
| Public deploy drift | Local proof passes but Build/Page proof is stale or narrower. |
| Report hygiene drift | Reports leak local paths, account names, raw import paths, or secret-like values. |

## Continuous Audit Waves

| Wave | Focus | State |
| --- | --- | --- |
| `.agent/audits/continuous/2026-07-01-wave-001/` | Authored map drift, collider/LOD drift, art readability, camera authority, interaction fakeout, combat readability, 60-player fakeout, staging, asset approval, audio feedback, public deploy drift, and report hygiene. | active |
| `.agent/audits/continuous/2026-07-01-wave-002/` | Reference parity against current battle-royale/extraction/game-architecture sources: 60-player product shape, squad identity, map POIs, zone pacing, extraction stakes, audio information, loot economy, staging, progression, content pipeline, and versioning. | active |

## Next Highest-Value Packet Cluster

Start with these when implementation resumes:

- `.agent/audits/completion/2026-07-01-goal-completion-gap/README.md`
- `.agent/audits/completion/2026-07-01-goal-completion-gap/requirement-matrix.md`
- `.agent/audits/completion/2026-07-01-goal-completion-gap/evidence-matrix.md`
- `.agent/audits/completion/2026-07-01-goal-completion-gap/evidence-atoms/atom-matrix.md`
- `.agent/audits/completion/2026-07-01-goal-completion-gap/evidence-atoms/research-matrix.md`
- `.agent/research/aaa-100/minute-interactions/README.md`
- `.agent/research/aaa-100/minute-interactions/interaction-matrix.md`
- `.agent/research/aaa-100/minute-interactions/research-matrix.md`
- `.agent/research/aaa-100/authored-map-cluster.md`
- `.agent/research/aaa-100/authored-terrain-kit-spec/README.md`
- `.agent/research/aaa-100/authored-terrain-kit-spec/implementation-batch-001/README.md`
- `.agent/research/aaa-100/authored-terrain-kit-spec/implementation-batch-001/batch-matrix.md`
- `.agent/research/aaa-100/drawn-terrain-source/README.md`
- `.agent/research/aaa-100/drawn-terrain-source/005-consumer-domain-matrix.md`
- `.agent/research/aaa-100/drawn-terrain-source/007-atomic-next-steps.md`
- `.agent/research/aaa-100/drawn-terrain-source/atomic-matrix.md`
- `.agent/research/aaa-100/drawn-terrain-source/research-matrix.md`
- `.agent/research/aaa-100/drawn-terrain-source/source-fixture-authoring/README.md`
- `.agent/research/aaa-100/drawn-terrain-source/source-fixture-authoring/source-fixture-authoring-matrix.md`
- `.agent/research/aaa-100/drawn-terrain-source/source-first-production-gate/README.md`
- `.agent/research/aaa-100/drawn-terrain-source/source-first-production-gate/decision-matrix.md`
- `.agent/research/aaa-100/drawn-terrain-source/source-first-production-gate/002-source-revision-contract.md`
- `.agent/research/aaa-100/drawn-terrain-source/source-first-production-gate/004-consumer-lockstep-gate.md`
- `.agent/research/aaa-100/drawn-terrain-source/massive-desert-map-blueprint/README.md`
- `.agent/research/aaa-100/drawn-terrain-source/massive-desert-map-blueprint/001-macro-map-shape.md`
- `.agent/research/aaa-100/drawn-terrain-source/massive-desert-map-blueprint/002-map-zones-and-pois.md`
- `.agent/research/aaa-100/drawn-terrain-source/massive-desert-map-blueprint/003-terrain-layer-stack.md`
- `.agent/research/aaa-100/drawn-terrain-source/massive-desert-map-blueprint/004-lod-streaming-cells.md`
- `.agent/research/aaa-100/drawn-terrain-source/massive-desert-map-blueprint/005-gameplay-route-and-risk-web.md`
- `.agent/research/aaa-100/drawn-terrain-source/massive-desert-map-blueprint/006-asset-anchor-blueprint.md`
- `.agent/research/aaa-100/drawn-terrain-source/massive-desert-map-blueprint/007-source-data-blueprint.md`
- `.agent/research/aaa-100/drawn-terrain-source/massive-desert-map-blueprint/009-acceptance-gates.md`
- `.agent/research/aaa-100/drawn-terrain-source/massive-desert-map-blueprint/atomic-matrix.md`
- `.agent/research/aaa-100/drawn-terrain-source/massive-desert-map-blueprint/research-matrix.md`
- `.agent/research/aaa-100/drawn-terrain-source/massive-desert-map-blueprint/atomic/README.md`
- `.agent/research/aaa-100/drawn-terrain-source/massive-desert-map-blueprint/simulation-matrix.md`
- `.agent/research/aaa-100/drawn-terrain-source/massive-desert-map-blueprint/audit-matrix.md`
- `.agent/research/aaa-100/drawn-terrain-source/massive-desert-map-blueprint/simulations/README.md`
- `.agent/research/aaa-100/drawn-terrain-source/massive-desert-map-blueprint/audits/README.md`
- `.agent/research/aaa-100/drawn-terrain-source/plateau-breakthrough-terrain-kit/README.md`
- `.agent/research/aaa-100/drawn-terrain-source/plateau-breakthrough-terrain-kit/atomic-matrix.md`
- `.agent/research/aaa-100/drawn-terrain-source/plateau-breakthrough-terrain-kit/research-matrix.md`
- `.agent/research/aaa-100/drawn-terrain-source/plateau-breakthrough-terrain-kit/simulation-matrix.md`
- `.agent/research/aaa-100/drawn-terrain-source/plateau-breakthrough-terrain-kit/audit-matrix.md`
- `.agent/research/aaa-100/drawn-terrain-source/source-artboard-production-workbook/README.md`
- `.agent/research/aaa-100/drawn-terrain-source/source-artboard-production-workbook/artboard-matrix.md`
- `.agent/research/aaa-100/drawn-terrain-source/source-artboard-production-workbook/010-implementation-readiness-gate.md`
- `.agent/research/aaa-100/drawn-terrain-source/source-artboard-production-workbook/audit-checklist.md`
- `.agent/research/aaa-100/drawn-terrain-source/source-artboard-production-workbook/atomic-matrix.md`
- `.agent/research/aaa-100/drawn-terrain-source/source-artboard-production-workbook/research-matrix.md`
- `.agent/research/aaa-100/drawn-terrain-source/source-artboard-production-workbook/simulation-matrix.md`
- `.agent/research/aaa-100/drawn-terrain-source/source-artboard-production-workbook/audit-matrix.md`
- `.agent/research/aaa-100/drawn-terrain-source/source-artboard-production-workbook/fixture-preflight-001/README.md`
- `.agent/research/aaa-100/drawn-terrain-source/source-artboard-production-workbook/fixture-preflight-001/fixture-preflight-matrix.md`
- `.agent/research/aaa-100/drawn-terrain-source/source-artboard-production-workbook/fixture-preflight-001/atomic-matrix.md`
- `.agent/research/aaa-100/drawn-terrain-source/source-artboard-production-workbook/fixture-preflight-001/research-matrix.md`
- `.agent/research/aaa-100/drawn-terrain-source/source-artboard-production-workbook/fixture-preflight-001/simulation-matrix.md`
- `.agent/research/aaa-100/drawn-terrain-source/source-artboard-production-workbook/fixture-preflight-001/audit-matrix.md`
- `.agent/research/aaa-100/drawn-terrain-source/source-artboard-production-workbook/fixture-preflight-001/micro-001-source-id-and-revision/README.md`
- `.agent/research/aaa-100/drawn-terrain-source/source-artboard-production-workbook/fixture-preflight-001/micro-001-source-id-and-revision/micro-matrix.md`
- `.agent/research/aaa-100/drawn-terrain-source/source-artboard-production-workbook/fixture-preflight-001/micro-001-source-id-and-revision/audit-matrix.md`
- `.agent/research/aaa-100/drawn-terrain-source/source-artboard-production-workbook/fixture-preflight-001/micro-002-bounds-scale-and-origin/README.md`
- `.agent/research/aaa-100/drawn-terrain-source/source-artboard-production-workbook/fixture-preflight-001/micro-002-bounds-scale-and-origin/micro-matrix.md`
- `.agent/research/aaa-100/drawn-terrain-source/source-artboard-production-workbook/fixture-preflight-001/micro-002-bounds-scale-and-origin/audit-matrix.md`
- `.agent/research/aaa-100/drawn-terrain-source/source-artboard-production-workbook/fixture-preflight-001/micro-003-height-sample-contract/README.md`
- `.agent/research/aaa-100/drawn-terrain-source/source-artboard-production-workbook/fixture-preflight-001/micro-003-height-sample-contract/micro-matrix.md`
- `.agent/research/aaa-100/drawn-terrain-source/source-artboard-production-workbook/fixture-preflight-001/micro-003-height-sample-contract/audit-matrix.md`
- `.agent/research/aaa-100/drawn-terrain-source/source-artboard-production-workbook/fixture-preflight-001/micro-004-normal-and-slope-contract/README.md`
- `.agent/research/aaa-100/drawn-terrain-source/source-artboard-production-workbook/fixture-preflight-001/micro-004-normal-and-slope-contract/micro-matrix.md`
- `.agent/research/aaa-100/drawn-terrain-source/source-artboard-production-workbook/fixture-preflight-001/micro-004-normal-and-slope-contract/audit-matrix.md`
- `.agent/research/aaa-100/drawn-terrain-source/source-artboard-production-workbook/fixture-preflight-001/micro-005-material-and-biome-mask-contract/README.md`
- `.agent/research/aaa-100/drawn-terrain-source/source-artboard-production-workbook/fixture-preflight-001/micro-005-material-and-biome-mask-contract/micro-matrix.md`
- `.agent/research/aaa-100/drawn-terrain-source/source-artboard-production-workbook/fixture-preflight-001/micro-005-material-and-biome-mask-contract/audit-matrix.md`
- `.agent/research/aaa-100/drawn-terrain-source/source-artboard-production-workbook/fixture-preflight-001/micro-006-walkable-blocker-mask-contract/README.md`
- `.agent/research/aaa-100/drawn-terrain-source/source-artboard-production-workbook/fixture-preflight-001/micro-006-walkable-blocker-mask-contract/micro-matrix.md`
- `.agent/research/aaa-100/drawn-terrain-source/source-artboard-production-workbook/fixture-preflight-001/micro-006-walkable-blocker-mask-contract/audit-matrix.md`
- `.agent/research/aaa-100/drawn-terrain-source/source-artboard-production-workbook/fixture-preflight-001/micro-007-route-annotation-contract/README.md`
- `.agent/research/aaa-100/drawn-terrain-source/source-artboard-production-workbook/fixture-preflight-001/micro-007-route-annotation-contract/micro-matrix.md`
- `.agent/research/aaa-100/drawn-terrain-source/source-artboard-production-workbook/fixture-preflight-001/micro-007-route-annotation-contract/audit-matrix.md`
- `.agent/research/aaa-100/drawn-terrain-source/source-artboard-production-workbook/fixture-preflight-001/micro-008-mine-and-gold-annotation-contract/README.md`
- `.agent/research/aaa-100/drawn-terrain-source/source-artboard-production-workbook/fixture-preflight-001/micro-008-mine-and-gold-annotation-contract/micro-matrix.md`
- `.agent/research/aaa-100/drawn-terrain-source/source-artboard-production-workbook/fixture-preflight-001/micro-008-mine-and-gold-annotation-contract/audit-matrix.md`
- `.agent/research/aaa-100/drawn-terrain-source/source-artboard-production-workbook/fixture-preflight-001/micro-009-cover-and-pressure-annotation-contract/README.md`
- `.agent/research/aaa-100/drawn-terrain-source/source-artboard-production-workbook/fixture-preflight-001/micro-009-cover-and-pressure-annotation-contract/micro-matrix.md`
- `.agent/research/aaa-100/drawn-terrain-source/source-artboard-production-workbook/fixture-preflight-001/micro-009-cover-and-pressure-annotation-contract/audit-matrix.md`
- `.agent/research/aaa-100/drawn-terrain-source/source-artboard-production-workbook/fixture-preflight-001/micro-010-cashout-and-extraction-annotation-contract/README.md`
- `.agent/research/aaa-100/drawn-terrain-source/source-artboard-production-workbook/fixture-preflight-001/micro-010-cashout-and-extraction-annotation-contract/micro-matrix.md`
- `.agent/research/aaa-100/drawn-terrain-source/source-artboard-production-workbook/fixture-preflight-001/micro-010-cashout-and-extraction-annotation-contract/audit-matrix.md`
- `.agent/research/aaa-100/drawn-terrain-source/source-artboard-production-workbook/fixture-preflight-001/micro-011-rail-and-train-reference-contract/README.md`
- `.agent/research/aaa-100/drawn-terrain-source/source-artboard-production-workbook/fixture-preflight-001/micro-011-rail-and-train-reference-contract/micro-matrix.md`
- `.agent/research/aaa-100/drawn-terrain-source/source-artboard-production-workbook/fixture-preflight-001/micro-011-rail-and-train-reference-contract/audit-matrix.md`
- `.agent/research/aaa-100/drawn-terrain-source/source-artboard-production-workbook/fixture-preflight-001/006-validator-plan.md`
- `.agent/research/aaa-100/drawn-terrain-source/source-artboard-production-workbook/fixture-preflight-001/010-hardening-audit.md`
- `.agent/research/aaa-100/digital-asset-family-atlas/README.md`
- `.agent/research/aaa-100/digital-asset-family-atlas/asset-family-matrix.md`
- `.agent/research/aaa-100/digital-asset-family-atlas/asset-family-research-matrix.md`
- `.agent/research/aaa-100/digital-asset-family-atlas/source-candidate-ledger.md`
- `.agent/research/aaa-100/free-toon-asset-candidate-expansion/README.md`
- `.agent/research/aaa-100/free-toon-asset-candidate-expansion/candidate-set-matrix.md`
- `.agent/research/aaa-100/free-toon-asset-candidate-expansion/atomic-matrix.md`
- `.agent/research/aaa-100/free-toon-asset-candidate-expansion/atomic-research-matrix.md`
- `.agent/research/aaa-100/free-toon-asset-candidate-expansion/atomic/README.md`
- `.agent/research/aaa-100/free-toon-asset-candidate-expansion/atomic-research/README.md`
- `.agent/research/aaa-100/free-toon-asset-candidate-expansion/simulation-matrix.md`
- `.agent/research/aaa-100/free-toon-asset-candidate-expansion/audit-matrix.md`
- `.agent/research/aaa-100/free-toon-asset-candidate-expansion/simulations/README.md`
- `.agent/research/aaa-100/free-toon-asset-candidate-expansion/audits/README.md`
- `.agent/research/aaa-100/free-toon-asset-candidate-expansion/import-readiness-audit.md`
- `.agent/research/aaa-100/free-toon-asset-candidate-expansion/research/source-reference-matrix.md`
- `.agent/research/aaa-100/free-toon-asset-candidate-expansion/research/hardening-audit.md`
- `.agent/research/aaa-100/asset-promotion-gates/README.md`
- `.agent/research/aaa-100/asset-promotion-gates/promotion-gate-matrix.md`
- `.agent/research/aaa-100/asset-promotion-gates/promotion-research-matrix.md`
- `.agent/research/aaa-100/asset-promotion-gates/gate-sequence.md`
- `.agent/research/aaa-100/asset-promotion-gates/runtime-promotion-contract.md`
- `.agent/research/aaa-100/end-to-end-kit-assembly/README.md`
- `.agent/research/aaa-100/end-to-end-kit-assembly/assembly-matrix.md`
- `.agent/research/aaa-100/end-to-end-kit-assembly/assembly-research-matrix.md`
- `.agent/research/aaa-100/end-to-end-kit-assembly/scene-site-kit-stack.md`
- `.agent/research/aaa-100/end-to-end-kit-assembly/event-flow-spine.md`
- `.agent/research/aaa-100/end-to-end-kit-assembly/validator-proof-plan.md`
- `.agent/research/aaa-100/end-to-end-kit-assembly/fakeout-register.md`
- `.agent/research/aaa-100/end-to-end-kit-assembly/kit-gap-register.md`
- `.agent/research/aaa-100/staging-simulation-lab/README.md`
- `.agent/research/aaa-100/staging-simulation-lab/staging-scenario-matrix.md`
- `.agent/research/aaa-100/staging-simulation-lab/staging-research-matrix.md`
- `.agent/research/aaa-100/staging-simulation-lab/mode-taxonomy.md`
- `.agent/research/aaa-100/staging-simulation-lab/bot-roster-contract.md`
- `.agent/research/aaa-100/staging-simulation-lab/simulated-vs-live-proof-boundary.md`
- `.agent/research/aaa-100/staging-simulation-lab/nexus-simulator-proof-contract.md`
- `.agent/research/aaa-100/staging-simulation-lab/human-proof-gates.md`
- `.agent/research/aaa-100/staging-simulation-lab/release-readiness-gate.md`
- `.agent/research/aaa-100/staging-simulation-lab/fakeout-register.md`
- `.agent/research/aaa-100/bot-ai-encounter-lab/README.md`
- `.agent/research/aaa-100/bot-ai-encounter-lab/bot-domain-map.md`
- `.agent/research/aaa-100/bot-ai-encounter-lab/source-reference-matrix.md`
- `.agent/research/aaa-100/bot-ai-encounter-lab/bot-roster-contract.md`
- `.agent/research/aaa-100/bot-ai-encounter-lab/behavior-state-contract.md`
- `.agent/research/aaa-100/bot-ai-encounter-lab/encounter-director-contract.md`
- `.agent/research/aaa-100/bot-ai-encounter-lab/staging-mode-boundary.md`
- `.agent/research/aaa-100/bot-ai-encounter-lab/simulation-proof-plan.md`
- `.agent/research/aaa-100/bot-ai-encounter-lab/combat-readability-policy.md`
- `.agent/research/aaa-100/bot-ai-encounter-lab/fakeout-register.md`
- `.agent/research/aaa-100/bot-ai-encounter-lab/validator-proof-plan.md`
- `.agent/research/aaa-100/bot-ai-encounter-lab/kit-gap-register.md`
- `.agent/research/aaa-100/live-network-authority-lab/README.md`
- `.agent/research/aaa-100/live-network-authority-lab/network-domain-map.md`
- `.agent/research/aaa-100/live-network-authority-lab/source-reference-matrix.md`
- `.agent/research/aaa-100/live-network-authority-lab/topology-decision-contract.md`
- `.agent/research/aaa-100/live-network-authority-lab/authority-model-contract.md`
- `.agent/research/aaa-100/live-network-authority-lab/replication-data-contract.md`
- `.agent/research/aaa-100/live-network-authority-lab/partition-handoff-contract.md`
- `.agent/research/aaa-100/live-network-authority-lab/latency-proof-plan.md`
- `.agent/research/aaa-100/live-network-authority-lab/proof-boundary-policy.md`
- `.agent/research/aaa-100/live-network-authority-lab/abuse-and-sanity-policy.md`
- `.agent/research/aaa-100/live-network-authority-lab/fakeout-register.md`
- `.agent/research/aaa-100/live-network-authority-lab/validator-proof-plan.md`
- `.agent/research/aaa-100/live-network-authority-lab/kit-gap-register.md`
- `.agent/research/aaa-100/player-feel-polish-lab/README.md`
- `.agent/research/aaa-100/player-feel-polish-lab/feel-axis-matrix.md`
- `.agent/research/aaa-100/player-feel-polish-lab/feel-research-matrix.md`
- `.agent/research/aaa-100/player-feel-polish-lab/motion-proof-policy.md`
- `.agent/research/aaa-100/player-feel-polish-lab/feedback-layer-contract.md`
- `.agent/research/aaa-100/player-feel-polish-lab/readability-fakeout-register.md`
- `.agent/research/aaa-100/player-feel-polish-lab/human-view-acceptance-gates.md`
- `.agent/research/aaa-100/player-feel-polish-lab/validator-proof-plan.md`
- `.agent/research/aaa-100/player-feel-polish-lab/kit-gap-register.md`
- `.agent/research/aaa-100/match-economy-retention-lab/README.md`
- `.agent/research/aaa-100/match-economy-retention-lab/economy-domain-map.md`
- `.agent/research/aaa-100/match-economy-retention-lab/source-reference-matrix.md`
- `.agent/research/aaa-100/match-economy-retention-lab/reward-loop-contract.md`
- `.agent/research/aaa-100/match-economy-retention-lab/extraction-stakes-contract.md`
- `.agent/research/aaa-100/match-economy-retention-lab/progression-boundary-policy.md`
- `.agent/research/aaa-100/match-economy-retention-lab/tuning-data-matrix.md`
- `.agent/research/aaa-100/match-economy-retention-lab/fakeout-register.md`
- `.agent/research/aaa-100/match-economy-retention-lab/validator-proof-plan.md`
- `.agent/research/aaa-100/match-economy-retention-lab/kit-gap-register.md`
- `.agent/research/aaa-100/authored-map-atomic-matrix.md`
- `.agent/research/aaa-100/authored-map-atomic-research-matrix.md`
- `.agent/simulations/aaa-100/simulation-matrix.md`
- `.agent/audits/aaa-100-step-audits/audit-matrix.md`
- `.agent/audits/continuous/2026-07-01-wave-001/audit-wave-matrix.md`
- `.agent/audits/continuous/2026-07-01-wave-001/edge-case-matrix.md`
- `.agent/audits/continuous/2026-07-01-wave-001/deployment-issue-register.md`
- `.agent/audits/continuous/2026-07-01-wave-002/audit-wave-matrix.md`
- `.agent/audits/continuous/2026-07-01-wave-002/reference-benchmark-matrix.md`
- `.agent/audits/continuous/2026-07-01-wave-002/reference-parity-risk-register.md`
- `.agent/audits/continuous/2026-07-01-wave-002/atomic/atomic-matrix.md`
- `.agent/audits/continuous/2026-07-01-wave-002/atomic/research-matrix.md`
- `.agent/research/aaa-100/021-terrain-intention-map/README.md`
- `.agent/research/aaa-100/022-top-down-terrain-plate/README.md`
- `.agent/research/aaa-100/023-height-mask-data-model/README.md`
- `.agent/research/aaa-100/024-lod-ring-contract/README.md`
- `.agent/research/aaa-100/026-collider-parity/README.md`
- `.agent/research/aaa-100/040-prop-protokit-library/README.md`
- 050 exploration camera complete
- 084 bot fill/single-player staging
