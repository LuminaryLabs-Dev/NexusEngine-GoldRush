# Squad Identity And Lobby Gap

Status: active docs-only

ID: 002
Domain: UX/network/presentation
Severity: high
Owner: n:network:party-room plus n:goldrush:party-lobby
Roadmap rows informed: 015, 054, 079, 085, 097

## Reference Observation

Apex foregrounds playable identities, modes, and squad-facing presentation. GoldRush needs the lobby to make Crew, Posse, or Outfit feel like a playable identity choice without becoming a three-card analytics screen.

## GoldRush Gap

The lobby has party and launch scaffolding, but the player-facing identity, 3D character presence, role clarity, and launch readiness need a stronger contract.

## Kit Implications

- party room owns code, leader, roster, and readiness
- presentation owns character preview and pedestal
- GoldRush custom kit owns Crew/Posse/Outfit mode copy and launch payload

## Evidence Required Before Calling This Resolved

- browser proof of 3D character preview and drag spin
- party code join proof with up to four slots
- leader-only launch proof with selected group type in payload

## Edge Cases

- do not expose shard structure as hero UI
- do not let the group type be large card selection again
- do not let presentation infer gameplay rules from CSS state

## Docs-Only Rule

This packet does not authorize runtime changes. It defines what the next implementation packet must prove before the gap can be marked resolved.
