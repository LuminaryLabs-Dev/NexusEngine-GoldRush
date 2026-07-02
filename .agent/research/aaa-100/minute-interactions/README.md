# Minute Interaction Atlas

Status: active docs-only

## Purpose

Break the final GoldRush playable loop into minute player-facing interactions so future implementation passes can resolve the game one action at a time without hiding work in broad systems.

## Counts

- 20 interaction families
- 120 minute interaction packets
- 120 paired research packets

## Family Matrix

| Family | Name | Domain | Owner | Interactions |
| --- | --- | --- | --- | --- |
| 001 | Title Entry | scene/presentation/audio | n:scene:site-loader plus n:goldrush:scene-flow | 6 |
| 002 | Title Settings | UX/audio/accessibility | n:audio:cue-state plus n:goldrush:settings | 6 |
| 003 | Party Lobby | network/UX | n:network:party-room plus n:goldrush:party-lobby | 6 |
| 004 | Character Preview | presentation/character | n:render:character-preview plus n:goldrush:prospector-animation | 6 |
| 005 | Group And Loadout Selection | UX/gameplay/content | n:goldrush:party-lobby plus n:goldrush:economy | 6 |
| 006 | Leader Launch | network/scene | n:network:party-room plus n:goldrush:train-loading | 6 |
| 007 | Loading Yard Arrival | scene/audio/world | n:scene:transition plus n:goldrush:train-loading | 6 |
| 008 | Train Boarding | control/scene/network | n:goldrush:train-loading plus n:control:character-movement | 6 |
| 009 | Train Departure | scene/camera/audio | n:scene:transition plus n:goldrush:train-loading | 6 |
| 010 | Gold Field Spawn | world/control/camera | n:goldrush:desert-world-map plus n:control:third-person-camera | 6 |
| 011 | Camera And Movement | control/physics | n:control:third-person-camera plus n:control:character-movement | 6 |
| 012 | Terrain Navigation | world/physics/render | n:world:terrain-raycast plus n:physics:collider | 6 |
| 013 | Resource Discovery | world/gameplay/render | n:world:placement-raycast plus n:goldrush:desert-prop-kits | 6 |
| 014 | Mining Hold | gameplay/audio/animation | n:gameplay:interaction-hold plus n:goldrush:mine-hold-action | 6 |
| 015 | Cargo Carry | gameplay/character/combat | n:gameplay:cargo plus n:goldrush:gold-carrying | 6 |
| 016 | Threat Telegraph | combat/audio/render | n:gameplay:combat-pressure plus n:goldrush:ambush-pressure | 6 |
| 017 | Cover And Combat | combat/control/world | n:goldrush:combat-route-guidance plus n:gameplay:combat-pressure | 6 |
| 018 | Cashout Route | gameplay/world/control | n:goldrush:player-route-guidance plus n:gameplay:extraction | 6 |
| 019 | Extraction Hold | gameplay/match/audio | n:gameplay:extraction plus n:match:receipts | 6 |
| 020 | Results And Replay | match/presentation/progression | n:match:results plus n:match:replay-summary | 6 |

## Files

- interaction-matrix.md
- research-matrix.md
- research/

## Use Rule

Before implementing a player-facing feature, find the matching minute interaction packet, confirm the owning kit, and define validator plus human-view proof before editing runtime code.
