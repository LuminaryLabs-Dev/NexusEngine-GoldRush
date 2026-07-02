# Input Command Buffer Data And Events

Status: planned

## Minimal Data

- `localSequence`
- `pendingCount`
- `lastAck`
- `oldestPendingMs`
- `commandTypes`

## Events

- `input.command.recorded`
- `input.command.submitted`
- `input.command.expired`

## Event Rules

- Events are facts, not UI messages.
- Network events must carry mode id and proof tier when retained in reports.
- Transport events cannot become gameplay receipts without authority acceptance.
- Receipt events must be ordered or explicitly rejected.

## Snapshot Rules

- Snapshot must be JSON serializable.
- Snapshot must include schema version when used across peers.
- Snapshot must avoid local machine details and browser profile details.
- Snapshot must be resettable between title, lobby, loading-yard, gold-field, and results.
