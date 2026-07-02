# Continuous Audit Wave 001 Matrix

Status: active docs-only

| ID | Packet | Domain | Severity | State | Owner | Roadmap rows informed |
| --- | --- | --- | --- | --- | --- | --- |
| 001 | [Map source drift](001-map-source-drift.md) | world | critical | open | n:goldrush:desert-world-map | 021, 022, 023, 024, 025, 026, 030, 031, 032, 033, 034, 035 |
| 002 | [Terrain collider and LOD drift](002-terrain-collider-lod-drift.md) | physics/world/render | critical | open | n:physics:collider plus n:world:terrain-heightfield | 023, 024, 025, 026, 034, 035, 090 |
| 003 | [Render and art readability drift](003-render-art-readability-drift.md) | render/art direction | high | open | n:render:three-scene plus n:goldrush:3d-scene-renderer | 014, 027, 028, 039, 040, 041, 045, 096 |
| 004 | [Camera and control authority drift](004-camera-control-authority-drift.md) | control/camera | critical | open | n:control:third-person-camera plus n:goldrush:exploration-camera | 050, 051, 052, 053, 081, 089 |
| 005 | [Interaction tactility fakeout](005-interaction-tactility-fakeout.md) | gameplay/UX | high | open | n:gameplay:interaction-hold plus n:goldrush:player-action-surface | 016, 056, 057, 058, 059, 060, 061, 063, 064, 066, 070 |
| 006 | [Combat encounter readability gap](006-combat-encounter-readability-gap.md) | combat/world/gameplay | high | open | n:gameplay:combat-pressure plus n:goldrush:ambush-pressure | 032, 071, 072, 073, 074, 075, 076, 077 |
| 007 | [Network 60-player scale fakeout](007-network-60-player-scale-fakeout.md) | network/runtime | critical | open | n:network:room-partitions plus n:goldrush:room-orchestration | 078, 079, 080, 081, 082, 083, 084, 085, 091 |
| 008 | [Single-player staging gap](008-single-player-staging-gap.md) | staging/validation | high | open | n:goldrush:single-player-staging | 055, 066, 084, 086, 087, 088, 089, 093, 094 |
| 009 | [Asset approval and runtime drift](009-asset-approval-runtime-drift.md) | content/legal/audio | critical | open | n:goldrush:asset-pipeline | 036, 037, 038, 042, 043, 044, 045, 096, 099 |
| 010 | [Audio, atmosphere, and feedback gap](010-audio-atmosphere-feedback-gap.md) | audio/presentation/gameplay | medium | open | n:audio:cue-state plus n:goldrush:music-and-stingers | 043, 044, 048, 056, 060, 061, 071, 076, 096 |
| 011 | [Public deploy proof drift](011-public-deploy-proof-drift.md) | release/validation | critical | open | n:runtime:validation plus n:goldrush:reality-status | 003, 010, 092, 095, 099, 100 |
| 012 | [Report hygiene and restart drift](012-report-sanitization-restart-drift.md) | governance/production | high | open | n:runtime:validation plus agent-it workspace | 001, 004, 006, 007, 017, 018, 019, 020, 098, 100 |
