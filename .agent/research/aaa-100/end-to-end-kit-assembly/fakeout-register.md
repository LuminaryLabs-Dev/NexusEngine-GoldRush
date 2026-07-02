# Kit Assembly Fakeout Register

Status: active docs-only

## Purpose

Name the specific ways a slice can look done while failing the final game goal.

## Register

| Slice | Fakeout to prevent |
| --- | --- |
| Runtime Domain Registry | A kit file exists but no runtime registry, lifecycle, or proof knows it exists. |
| Scene Site Loader And Flow | The DOM changes screens while runtime sites and kit groups do not actually change. |
| Title Audio Entry | A sound plays but is not tied to semantic cue state or asset approval status. |
| Lobby Party Character Preview | A party code exists but character identity remains a 2D placeholder or the preview has no state contract. |
| Group Selection Match Config | The UI lets players choose a label but the runtime match config ignores it. |
| Train Loading Sequence | The scene changes to the field without the player performing a readable train interaction. |
| Train Boarding Party Sync | The leader launches but member readiness, disconnect, or late join state cannot be inspected. |
| Gold Field Spawn Map Source | A player appears in a desert scene but the map source cannot explain why that spawn is valid. |
| Third Person Controller | Movement works in one proof only because a helper teleports or directly places the player. |
| Terrain Grounding Physics | The player appears grounded from one camera angle but actual heightfield and collider disagree. |
| Resource Discovery Protokits | A gold marker is visible but not tied to an object descriptor, terrain placement, or interaction affordance. |
| Mining Hold Action | A script adds gold directly without an in-world object, hold time, or visible result. |
| Cargo Carry Risk | A score number increases but the player does not feel cargo weight, value, or danger. |
| Threat Ambush Pressure | Combat pressure exists as a hidden value but no player-facing warning, route, cover, or choice changes. |
| Cover Combat Route | A proof directly activates combat or cover without walking through a readable encounter path. |
| Cashout Extraction Sites | Cashout completes from any location or through a direct state call with no route, site, or timer. |
| Scoring Results Replay | Results displays fixed copy or narrow proof values instead of receipt-backed match facts. |
| Bot Fill Single Player Staging | A solo proof is described as multiplayer readiness without bot roster, scenario, or scale evidence. |
| Sixty Player Room Scale | Room partition data exists but no 60-player state budget, disconnect/rejoin case, or snapshot fanout proof exists. |
| Deploy Proof Restart | A branch builds or a local proof passes but the public player-view state is stale or narrower. |

