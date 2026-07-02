# Continuous Audit Wave 002 Matrix

Status: active docs-only

| ID | Packet | Domain | Severity | State | Owner | Roadmap rows informed |
| --- | --- | --- | --- | --- | --- | --- |
| 001 | [60 Player Product Pillar Gap](001-60-player-product-pillar-gap.md) | network/product/runtime | critical | open | n:network:room-partitions plus n:goldrush:room-orchestration | 012, 078, 079, 080, 081, 084, 085, 086, 091 |
| 002 | [Squad Identity And Lobby Gap](002-squad-identity-and-lobby-gap.md) | UX/network/presentation | high | open | n:network:party-room plus n:goldrush:party-lobby | 015, 054, 079, 085, 097 |
| 003 | [Massive Map POI Readability Gap](003-massive-map-poi-readability-gap.md) | world/art/render | critical | open | n:goldrush:desert-world-map plus n:render:terrain-bands | 021, 022, 028, 029, 031, 032, 033, 096 |
| 004 | [Zone Pressure Pacing Gap](004-zone-pressure-pacing-gap.md) | battle royale/match/gameplay | critical | open | n:gameplay:combat-pressure plus n:goldrush:final-rush-pressure | 016, 061, 070, 077, 087, 088, 089 |
| 005 | [Extraction Stakes And Loss Gap](005-extraction-stakes-and-loss-gap.md) | gameplay/match/progression | high | open | n:gameplay:extraction plus n:match:receipts plus n:match:results | 058, 059, 060, 061, 067, 068, 069, 070 |
| 006 | [Audio As World Information Gap](006-audio-as-world-information-gap.md) | audio/presentation/gameplay | high | open | n:audio:cue-state plus n:goldrush:music-and-stingers | 043, 044, 056, 060, 061, 071, 076, 096 |
| 007 | [Loot Economy And Loadout Gap](007-loot-economy-and-loadout-gap.md) | gameplay/content/progression | medium | open | n:gameplay:cargo plus n:goldrush:economy | 058, 063, 064, 069, 072, 096 |
| 008 | [Rotation And Encounter Distance Gap](008-rotation-and-encounter-distance-gap.md) | world/control/combat | high | open | n:goldrush:desert-world-map plus n:goldrush:combat-route-guidance | 029, 032, 050, 051, 052, 071, 074, 077 |
| 009 | [Staging And Bot Proof Gap](009-staging-and-bot-proof-gap.md) | staging/validation/network | critical | open | n:goldrush:single-player-staging plus n:runtime:validation | 055, 084, 086, 087, 088, 089, 091, 094 |
| 010 | [Progression Replay And Retention Gap](010-progression-replay-and-retention-gap.md) | match/progression/product | medium | open | n:match:results plus n:match:replay-summary plus n:goldrush:progression | 067, 068, 069, 093, 098 |
| 011 | [Content Pipeline And Toon AAA Gap](011-content-pipeline-and-toon-aaa-gap.md) | content/art/render/legal | critical | open | n:goldrush:asset-pipeline plus n:render:character-preview plus prop protokits | 036, 037, 038, 039, 040, 041, 042, 045, 046, 047, 048, 096 |
| 012 | [Live Ops Versioning And Restart Gap](012-live-ops-versioning-and-restart-gap.md) | release/governance/runtime | high | open | n:runtime:snapshot plus agent-it workspace plus Build deployment | 001, 003, 004, 007, 010, 092, 095, 099, 100 |

## Resolution Rule

A packet moves from open to resolved only when the relevant kit exposes data/events/snapshot, the closest validator passes, human-view proof exists for player-facing behavior, and public proof is captured when deployment is part of the claim.

## Atomic Layer

- [Wave 002 atomic matrix](atomic/atomic-matrix.md)
- [Wave 002 atomic research matrix](atomic/research-matrix.md)

Use the atomic layer before implementation so each reference-parity gap becomes kit-owned data, event, snapshot, validation, and proof work instead of broad AAA commentary.
