# GoldRush Local/Public Live Audit

Status: failed

## Comparison

```json
{
  "status": "single-target",
  "notes": [
    "comparison requires both local and public"
  ]
}
```

## local

Status: failed

URL: http://127.0.0.1:5177/NexusEngine-GoldRush/?publicSmoke=2026-07-01T01-54-10-801Z

### Steps

- passed: load-title (1704ms)
- passed: enter-lobby (2738ms)
- passed: start-loading-yard (9284ms)
- failed: walk-board-train (45039ms) - step:walk-board-train timed out after 45000ms

### Domain Audit

```json
{}
```

### Issues

- fail: proof - step:walk-board-train timed out after 45000ms

### Screenshots

- screenshots/live-state-audit/local/01-title-2026-07-01T01-54-10-801Z.png
- screenshots/live-state-audit/local/02-lobby-2026-07-01T01-54-10-801Z.png
- screenshots/live-state-audit/local/03-loading-yard-2026-07-01T01-54-10-801Z.png

### Videos

- none

