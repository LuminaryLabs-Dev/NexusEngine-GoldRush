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

URL: http://127.0.0.1:5177/NexusEngine-GoldRush/?publicSmoke=2026-07-01T01-58-23-196Z

### Steps

- passed: load-title (2303ms)
- passed: enter-lobby (4900ms)
- passed: start-loading-yard (17755ms)
- failed: walk-board-train (44312ms) - page.screenshot: Timeout 30000ms exceeded.
Call log:
[2m  - taking page screenshot[22m


### Domain Audit

```json
{}
```

### Issues

- fail: proof - page.screenshot: Timeout 30000ms exceeded.
Call log:
[2m  - taking page screenshot[22m


### Screenshots

- screenshots/live-state-audit/local/01-title-2026-07-01T01-58-23-196Z.png
- screenshots/live-state-audit/local/02-lobby-2026-07-01T01-58-23-196Z.png
- screenshots/live-state-audit/local/03-loading-yard-2026-07-01T01-58-23-196Z.png
- screenshots/live-state-audit/local/99-failure-2026-07-01T01-58-23-196Z.png

### Videos

- none

