# GoldRush Local/Public Live Audit

Status: failed

## Comparison

```json
{
  "status": "matched",
  "mismatches": [],
  "localStatus": "failed",
  "publicStatus": "failed"
}
```

## local

Status: failed

URL: http://127.0.0.1:5173/NexusEngine-GoldRush/?publicSmoke=2026-07-01T03-05-52-939Z

### Steps

- passed: load-title (2027ms)
- passed: enter-lobby (2888ms)
- passed: start-loading-yard (7685ms)
- failed: walk-board-train (60841ms) - page.waitForFunction: Timeout 45000ms exceeded.

### Domain Audit

```json
{}
```

### Issues

- fail: proof - page.waitForFunction: Timeout 45000ms exceeded.

### Screenshots

- screenshots/live-state-audit/local/01-title-2026-07-01T03-05-52-939Z.png
- screenshots/live-state-audit/local/02-lobby-2026-07-01T03-05-52-939Z.png
- screenshots/live-state-audit/local/03-loading-yard-2026-07-01T03-05-52-939Z.png
- screenshots/live-state-audit/local/99-failure-2026-07-01T03-05-52-939Z.png

### Videos

- none

## public

Status: failed

URL: https://luminarylabs-dev.github.io/NexusEngine-GoldRush/?publicSmoke=2026-07-01T03-05-52-939Z

### Steps

- passed: load-title (2235ms)
- passed: enter-lobby (8845ms)
- passed: start-loading-yard (9013ms)
- failed: walk-board-train (65268ms) - step:walk-board-train timed out after 65000ms

### Domain Audit

```json
{}
```

### Issues

- fail: proof - step:walk-board-train timed out after 65000ms

### Screenshots

- screenshots/live-state-audit/public/01-title-2026-07-01T03-05-52-939Z.png
- screenshots/live-state-audit/public/02-lobby-2026-07-01T03-05-52-939Z.png
- screenshots/live-state-audit/public/03-loading-yard-2026-07-01T03-05-52-939Z.png

### Videos

- none

