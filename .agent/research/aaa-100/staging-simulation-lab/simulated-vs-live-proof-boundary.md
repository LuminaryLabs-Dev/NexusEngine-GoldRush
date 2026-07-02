# Simulated Versus Live Proof Boundary

Status: active docs-only

## Rule

A proof report must never use simulated entity count as live human count.

## Required Fields

- proof target.
- mode kind.
- human clients.
- bot clients.
- simulated entities.
- live network peers.
- public build target.
- local build target.
- remaining unproven live behavior.

## Claim Boundaries

| Proof type | Can claim | Cannot claim |
| --- | --- | --- |
| CLI validator | Data contracts and invariants. | Player readability or live multiplayer feel. |
| NexusSimulator | Scenario logic, event flow, state budget, fakeout prevention. | Human-view readability or live network readiness. |
| Local Playwright | Local browser player route and visuals. | Public deploy correctness unless target is public. |
| Public Playwright | Published browser proof for the tested scope. | Live 60-player networking unless live clients are used. |
| PeerJS local contexts | Party sync and multi-context browser behavior. | Internet-scale matchmaking or 60 live humans. |
| Future live network proof | Live client behavior for tested player count. | Untested bot, public, or production release behavior. |

