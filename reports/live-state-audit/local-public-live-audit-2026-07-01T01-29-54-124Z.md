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

URL: http://127.0.0.1:5177/NexusEngine-GoldRush/?publicSmoke=2026-07-01T01-29-54-124Z

### Steps

- passed: load-title (1865ms)
- passed: enter-lobby (7533ms)
- passed: start-loading-yard (32541ms)
- failed: walk-board-train (41312ms) - failed to board train through camera-relative movement before timeout

### Domain Audit

```json
{}
```

### Issues

- fail: proof - failed to board train through camera-relative movement before timeout

### Screenshots

- screenshots/live-state-audit/local/01-title-2026-07-01T01-29-54-124Z.png
- screenshots/live-state-audit/local/02-lobby-2026-07-01T01-29-54-124Z.png
- screenshots/live-state-audit/local/03-loading-yard-2026-07-01T01-29-54-124Z.png
- screenshots/live-state-audit/local/99-failure-2026-07-01T01-29-54-124Z.png

### Videos

- output/live-state-audit-videos/local-2026-07-01T01-29-54-124Z/page@6397a8ce735d28811feea7bd83fb400a.webm

