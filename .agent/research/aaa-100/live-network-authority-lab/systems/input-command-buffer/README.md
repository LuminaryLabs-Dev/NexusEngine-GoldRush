# 10 Input Command Buffer

Status: planned

## Purpose

Buffer and sequence movement, interact, aim, fire, cover, and cashout commands before authority resolution.

## Player Need

Controls must feel responsive while the match still resolves actions in one order.

## Owning Kits

- Generic incubator candidate: `n:network:input-buffer`
- GoldRush custom kit: `n:goldrush:input-command-buffer`

## Public API Seed

- `recordInput(input)`
- `submitCommand(command)`
- `getInputBuffer()`

## Internal API Seed

- `stampCommand(command)`
- `dedupeCommand(command)`
- `expireOldCommands(now)`

## Events

- `input.command.recorded`
- `input.command.submitted`
- `input.command.expired`

## Snapshot

- `localSequence`
- `pendingCount`
- `lastAck`
- `oldestPendingMs`
- `commandTypes`

## Validator

`validate-input-command-buffer.mjs`

## Player-View Proof

Repeated interact/fire/movement inputs create ordered commands and do not duplicate cashout or damage receipts.

## Risk If Missing

Without command buffering, prediction and authority will fight each other and create double actions.
