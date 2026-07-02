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

URL: http://127.0.0.1:5177/NexusEngine-GoldRush/?publicSmoke=2026-07-01T01-49-36-489Z

### Steps

- passed: load-title (2078ms)
- passed: enter-lobby (4343ms)
- passed: start-loading-yard (17304ms)
- failed: walk-board-train (20239ms) - step:walk-board-train timed out after 20000ms

### Domain Audit

```json
{}
```

### Issues

- fail: proof - step:walk-board-train timed out after 20000ms

### Screenshots

- screenshots/live-state-audit/local/01-title-2026-07-01T01-49-36-489Z.png
- screenshots/live-state-audit/local/02-lobby-2026-07-01T01-49-36-489Z.png
- screenshots/live-state-audit/local/03-loading-yard-2026-07-01T01-49-36-489Z.png
- screenshots/live-state-audit/local/99-failure-2026-07-01T01-49-36-489Z.png

### Videos

- output/live-state-audit-videos/local-2026-07-01T01-49-36-489Z/page@ded0f8e1991ddbb6002d800c72086306.webm

