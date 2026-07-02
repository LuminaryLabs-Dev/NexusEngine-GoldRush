# Party To Match Handoff Data And Events

Status: planned

## Minimal Data

- `partyCode`
- `leaderId`
- `memberIds`
- `readyCount`
- `handoffReceiptId`

## Events

- `party.handoff.created`
- `party.handoff.accepted`
- `party.handoff.sealed`

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
