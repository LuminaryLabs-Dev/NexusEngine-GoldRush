# Authority Model Contract

Status: active

## Purpose

Define the future authority model before implementing live match networking.

## Candidate Models

- Host authoritative peer.
- Elected host with migration.
- Thin authoritative relay service.
- Simulator-only authority for staging.

## Decision Rule

GoldRush may use PeerJS for transport, but game-changing receipts require a named authority. If no authority is available, the run must be labeled as cooperative or staging, not fair live multiplayer.

## Authoritative Facts

- Match seed.
- Spawn and handoff receipts.
- Mine completion.
- Cargo add/drop/loss.
- Combat damage.
- Cashout completion/interruption.
- Final score and results.
