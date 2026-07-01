# Train Boarding Party Readiness

Status: active
Date: 2026-06-30

## Domain

Scene transition / loading yard / party launch.

## Sources

- Nielsen Norman Group, progress indicators: https://www.nngroup.com/articles/progress-indicators/
- Apex Legends squad launch reference: https://www.ea.com/games/apex-legends
- Game Developer loading/wait-state design research surface: https://www.gamedeveloper.com/

## Research Takeaways

- Loading and transition states need explicit status because players lose trust when a click appears to do hidden work.
- Battle-royale launch flow works best when the squad remains attached to one launch authority and the transition reinforces that the group is moving together.
- The GoldRush train scene should not be only a decorative pause. It should prove party readiness, local boarding, train departure, and handoff into the large match.
- The first reliable version should use deterministic receipts and snapshots before trying to render every party member interaction perfectly.

## GoldRush Application

- `n:goldrush:train-loading` owns the train handoff and should expose a boarding manifest.
- The manifest must list expected party seats, local player id, leader id, waiting members, boarded members, auto-followed members, and readiness.
- The local player must board through the in-world trigger.
- Non-local party members can auto-follow in the current browser prototype, but that must be explicit in receipts so it is not mistaken for synchronized multiplayer.
- The match handoff is valid only after local boarding and full manifest readiness.

## Gaps

- Peer-synchronized boarding readiness still needs a later pass.
- The loading-yard renderer should eventually show each party member at a visible boarding marker.
- The player needs stronger in-world feedback at the train door: prompt, door affordance, platform highlight, and departure countdown.
