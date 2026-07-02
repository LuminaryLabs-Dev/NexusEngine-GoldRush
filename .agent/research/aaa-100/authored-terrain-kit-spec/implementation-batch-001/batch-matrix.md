# Implementation Batch 001 Matrix

Status: active docs-only

## Purpose

Track the first implementation-ready authored terrain packets without touching runtime code.

| Packet | File | Domain | Target kit | Roadmap atoms | State |
| --- | --- | --- | --- | --- | --- |
| 001 | [Source Fixture File Layout](001-source-fixture-file-layout.md) | world | n:world:authored-terrain-mesh | 021, 022, 023 | implemented-local source identity fixture |
| 002 | [Source Revision Hash Policy](002-source-revision-hash-policy.md) | runtime | n:runtime:snapshot plus n:world:authored-terrain-mesh | 021, 023, 024, 026 | implemented-local source hash/revision policy |
| 003 | [World Bounds And Scale Fixture](003-world-bounds-and-scale-fixture.md) | world | n:world:authored-terrain-mesh | 021, 022 | implemented-local bounds/scale/origin fixture |
| 004 | [Height Grid Fixture](004-height-grid-fixture.md) | world | n:world:terrain-heightfield | 022, 023, 026 | implemented-local height sample fixture |
| 005 | [Normal Slope Derivation](005-normal-slope-derivation.md) | world | n:world:terrain-raycast | 023, 026 | implemented-local normal/slope source fixture |
| 006 | [Mask Stack Fixture](006-mask-stack-fixture.md) | world | n:world:terrain-patches | 021, 022, 023, 040 | active docs-only |
| 007 | [Chunk Index Fixture](007-chunk-index-fixture.md) | world | n:world:terrain-patches | 024, 026 | active docs-only |
| 008 | [Raycast Down Fixture](008-raycast-down-fixture.md) | world | n:world:terrain-raycast | 023, 026, 040 | active docs-only |
| 009 | [Placement Anchor Fixture](009-placement-anchor-fixture.md) | world | n:world:placement-raycast | 021, 023, 040 | active docs-only |
| 010 | [LOD Band Fixture](010-lod-band-fixture.md) | render | n:render:terrain-bands | 024 | active docs-only |
| 011 | [Collider Parity Fixture](011-collider-parity-fixture.md) | physics | n:physics:collider | 026 | active docs-only |
| 012 | [Desert Map Zone Fixture](012-desert-map-zone-fixture.md) | gameplay | n:goldrush:desert-world-map | 021, 023, 040 | active docs-only |
| 013 | [Render Consumer Contract](013-render-consumer-contract.md) | render | n:render:three-scene plus n:render:terrain-bands | 022, 024, 040 | active docs-only |
| 014 | [Physics Consumer Contract](014-physics-consumer-contract.md) | physics | n:physics:world plus n:physics:collider plus n:physics:query | 026 | active docs-only |
| 015 | [Control Consumer Contract](015-control-consumer-contract.md) | control | n:control:third-person-camera plus n:control:character-movement | 023, 026 | active docs-only |
| 016 | [Gameplay Consumer Contract](016-gameplay-consumer-contract.md) | gameplay | n:gameplay:interaction-hold plus n:gameplay:cargo plus n:gameplay:extraction | 021, 023, 040 | active docs-only |
| 017 | [Prop Protokit Consumer Contract](017-prop-protokit-consumer-contract.md) | render plus world | n:render:micro-object-instancing plus GoldRush prop protokits | 040 | active docs-only |
| 018 | [Validation CLI Contract](018-validation-cli-contract.md) | runtime | n:runtime:validation | 021, 022, 023, 024, 026, 040 | active docs-only |
| 019 | [Human View Proof Contract](019-human-view-proof-contract.md) | proof | n:runtime:validation plus GoldRush proof tools | 021, 022, 024, 026, 040 | active docs-only |
| 020 | [Public Deploy Proof Contract](020-public-deploy-proof-contract.md) | deployment | n:runtime:validation plus Build branch workflow | 021, 024, 026, 040 | active docs-only |
| 021 | [Sanitized Report Contract](021-sanitized-report-contract.md) | runtime | n:runtime:validation | all authored terrain packets | active docs-only |
| 022 | [Restart Rollback Contract](022-restart-rollback-contract.md) | runtime | n:runtime:snapshot plus n:runtime:domain-registry | 021, 023, 024, 026 | active docs-only |
| 023 | [Open Questions](023-open-questions.md) | planning | all authored terrain kits | 021, 022, 023, 024, 026, 040 | active docs-only |
| 024 | [Implementation Stop Conditions](024-implementation-stop-conditions.md) | planning | all authored terrain kits | 021, 022, 023, 024, 026, 040 | active docs-only |

## First Coding Order After Approval

1. Source fixture file layout
2. Source revision hash policy
3. World bounds and scale fixture
4. Height grid fixture
5. Mask stack fixture
6. Chunk index fixture
7. Raycast down fixture
8. Placement anchor fixture
9. LOD band fixture
10. Collider parity fixture
11. Consumer contracts
12. Validation and proof contracts

## Gate

Do not implement a consumer before the source fixture, revision policy, height grid, mask stack, chunk index, raycast down, and collider parity packets have a matching validator plan.
