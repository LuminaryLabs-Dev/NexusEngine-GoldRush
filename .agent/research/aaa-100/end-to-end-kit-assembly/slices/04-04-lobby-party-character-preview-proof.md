# Lobby Party Character Preview - Proof

Status: planned docs-only
Slice: 04 Lobby Party Character Preview
Domain: network/presentation/character
Scene/site: site.lobby-character
Generic kit: n:network:party-room plus n:render:character-preview
GoldRush kit: n:goldrush:party-lobby plus n:goldrush:prospector-preview

## Purpose

Define CLI, simulator, Playwright, human-view, and public proof gates that would make this slice believable.

## Slice Intention

Let a small squad form by code while seeing a real 3D character identity surface.

## Atomic Substeps

1. Confirm this slice is owned by `n:goldrush:party-lobby plus n:goldrush:prospector-preview` and not by renderer-only logic.
2. Confirm the generic kit dependency remains neutral and promotable when applicable.
3. Define the smallest public API command or query the next slice needs.
4. Define the private work the kit may do behind the API.
5. Define the event payload emitted when the slice changes.
6. Define the serializable snapshot for browser and simulator proof.
7. Define reset behavior for scene changes, match restart, and failed proof.
8. Define the main negative fixture or fakeout case.
9. Define one human-view acceptance check when the slice is player-facing.
10. Define the next slice that consumes this output.

## Event And Snapshot

- Event: `party.lobby.member.changed`
- Snapshot: `partyLobbyCharacterPreview`
- Reset rule: clear transient scene state, retain durable receipts only when the match lifecycle owns them.

## Validator Seed

`proof:peer-party-boarding plus character-preview proof`

## Human-View Proof Seed

host/member party state and draggable Three.js character preview are visible before launch

## Known Fakeout

A party code exists but character identity remains a 2D placeholder or the preview has no state contract.

## Implementation Boundary

This is docs-only. Runtime code changes, new local kits, asset movement, deployment, and proof execution are deferred until implementation mode resumes.

