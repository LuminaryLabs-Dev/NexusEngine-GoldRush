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

URL: http://127.0.0.1:5173/NexusEngine-GoldRush/?publicSmoke=2026-07-01T03-10-16-613Z

### Steps

- passed: load-title (2686ms)
- passed: enter-lobby (4857ms)
- passed: start-loading-yard (15368ms)
- failed: walk-board-train (65005ms) - step:walk-board-train timed out after 65000ms

### Domain Audit

```json
{}
```

### Issues

- fail: proof - step:walk-board-train timed out after 65000ms
- warn: proof - run-stage-focus click skipped: locator.click: Timeout 3000ms exceeded.
Call log:
[2m  - waiting for locator('[data-screen-panel="run"]')[22m
[2m    - locator resolved to <section class="gameStage" data-screen-panel="run" aria-label="Gold Rush 3D game">…</section>[22m

- warn: proof - 04-gold-field screenshot failed: page.evaluate: Target page, context or browser has been closed

### Screenshots

- screenshots/live-state-audit/local/01-title-2026-07-01T03-10-16-613Z.png
- screenshots/live-state-audit/local/02-lobby-2026-07-01T03-10-16-613Z.png
- screenshots/live-state-audit/local/03-loading-yard-2026-07-01T03-10-16-613Z.png
- screenshots/live-state-audit/local/99-failure-2026-07-01T03-10-16-613Z.png

### Videos

- none

