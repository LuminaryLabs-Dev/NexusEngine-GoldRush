# Gameplay Consumer Contract

Status: active docs-only

Packet: 016
Domain: gameplay
Target kit: n:gameplay:interaction-hold plus n:gameplay:cargo plus n:gameplay:extraction
Roadmap atoms: 021, 023, 040

## Purpose

Define how mining, carrying, cashout, and pressure systems consume map zones, anchors, masks, and terrain-grounded affordances.

## Why This Prevents Plateau

A map does not become playable just because it has gold props; the loop needs readable positions, reasons, risks, and receipts.

## Data Exposed

- interactionTarget
- affordanceClass
- cargoState
- extractionZone
- routeStage
- receiptIds
- zoneRisk

## Public API Shape

- findNearestAffordance(playerState)
- startHoldAction(target)
- depositCargo(zoneId)
- getGameplayLoopSnapshot()

## Events And Snapshot

- mineHoldStarted
- cargoCarried
- cashoutDeposited
- routeStageAdvanced

Snapshot must include the target kit, source revision, consumer revision, validation state, and enough domain state to debug without leaking machine-local paths.

## Validation And Proof

- CLI validates mine -> carry -> cashout -> score route from authored anchors
- human-view proof confirms player can read what to do without debug overlay

## Edge Cases And Stop Conditions

- Do not let hidden test helpers complete the loop.
- Do not allow actions without terrain-grounded targets.
- Stop if route guidance and world placement disagree.

## Implementation Note

Do not code from this packet alone. Read the parent authored terrain spec, the matching atomic map packet, the matching four research packets, the implementation simulation, and the hardening audit before editing runtime files.
