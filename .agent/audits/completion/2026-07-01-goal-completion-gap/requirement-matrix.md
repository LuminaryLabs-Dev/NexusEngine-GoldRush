# Requirement Matrix

Status: active docs-only

| ID | Requirement | Domain | Owner | Current status |
| --- | --- | --- | --- | --- |
| 001 | [Unified Gold Rush Identity](001-unified-gold-rush-identity.md) | product/runtime | n:goldrush:runtime plus n:goldrush:legacy-modes | incomplete |
| 002 | [NexusRealtime Kit Architecture](002-nexusrealtime-kit-architecture.md) | architecture/runtime | n:runtime:domain-registry plus GoldRush custom kits | partial |
| 003 | [Approved Legacy Assets Runtime](003-approved-legacy-assets-runtime.md) | content/legal/assets | n:goldrush:asset-pipeline | incomplete |
| 004 | [Actual Audio Music Promotion](004-actual-audio-music-promotion.md) | audio/content/legal | n:audio:cue-state plus n:goldrush:music-and-stingers | incomplete |
| 005 | [Authored Desert Map Source](005-authored-desert-map-source.md) | world/render/physics | n:world:authored-terrain-mesh plus n:goldrush:desert-world-map | planned-not-implemented |
| 006 | [Terrain Collider And Grounding](006-terrain-collider-and-grounding.md) | physics/control/world | n:physics:collider plus n:world:terrain-raycast | partial |
| 007 | [Third Person Camera And Controls](007-third-person-camera-and-controls.md) | control/camera | n:control:third-person-camera plus n:goldrush:exploration-camera | partial |
| 008 | [Character Rig Animation Fidelity](008-character-rig-animation-fidelity.md) | character/animation/render | n:animation:state plus n:goldrush:prospector-animation | incomplete |
| 009 | [Player Facing Mining Cashout Loop](009-player-facing-mining-cashout-loop.md) | gameplay/UX | n:gameplay:interaction-hold plus n:goldrush:player-action-surface | partial |
| 010 | [Combat Playable And Legible](010-combat-playable-legible.md) | combat/world/gameplay | n:gameplay:combat-pressure plus n:goldrush:combat-route-guidance | incomplete |
| 011 | [Extraction Stakes Results](011-extraction-stakes-results.md) | match/gameplay/results | n:gameplay:extraction plus n:match:receipts plus n:match:results | partial |
| 012 | [Sixty Player Scale Readiness](012-sixty-player-scale-readiness.md) | network/staging/runtime | n:network:room-partitions plus n:goldrush:room-orchestration | incomplete |
| 013 | [Single Player Staging Environment](013-single-player-staging-environment.md) | staging/validation | n:goldrush:single-player-staging plus n:runtime:validation | planned-not-implemented |
| 014 | [Battle Royale Zone Pacing](014-battle-royale-zone-pacing.md) | battle royale/match | n:goldrush:final-rush-pressure plus n:match:lifecycle | planned-partial |
| 015 | [Toon AAA Visual Fidelity](015-toon-aaa-visual-fidelity.md) | art/render/content | n:render:three-scene plus n:goldrush:asset-pipeline | incomplete |
| 016 | [Public Build Deploy Proof](016-public-build-deploy-proof.md) | release/validation | n:runtime:validation plus Build workflow | partial |
| 017 | [Local Public Human View Proof](017-local-public-human-view-proof.md) | validation/human-view | n:runtime:validation plus proof tools | partial |
| 018 | [Versioning Restart Discipline](018-versioning-restart-discipline.md) | governance/runtime | agent-it workspace plus n:runtime:snapshot | partial |
| 019 | [Market Player AAA Gap Coverage](019-market-player-aaa-gap-coverage.md) | product/research | agent-it research packets plus reference parity waves | planned-partial |
| 020 | [Final Completion Audit Gate](020-final-completion-audit-gate.md) | governance/validation | agent-it workspace plus n:runtime:validation | open |

## Resolution Rule

A requirement can move to proven-current only when the evidence is current, authoritative, direct, and broad enough for the requirement. Partial validators, local-only screenshots, stale public reports, or docs-only plans are not enough.

## Atomic Evidence Layer

- [Completion evidence atom matrix](evidence-atoms/atom-matrix.md)
- [Completion evidence research matrix](evidence-atoms/research-matrix.md)

Each requirement has six evidence atoms. A requirement cannot be marked proven-current until those atoms have current proof or an explicit unresolved caveat.
