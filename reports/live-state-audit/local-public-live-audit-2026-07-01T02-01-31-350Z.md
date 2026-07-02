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

URL: http://127.0.0.1:5177/NexusEngine-GoldRush/?publicSmoke=2026-07-01T02-01-31-350Z

### Steps

- passed: load-title (2883ms)
- passed: enter-lobby (2473ms)
- passed: start-loading-yard (9669ms)
- failed: walk-board-train (37884ms) - locator.click: Timeout 30000ms exceeded.
Call log:
[2m  - waiting for locator('[data-screen-panel="run"]')[22m
[2m    - locator resolved to <section class="gameStage" data-screen-panel="run" aria-label="Gold Rush 3D game">…</section>[22m
[2m  - attempting click action[22m
[2m    - waiting for element to be visible, enabled and stable[22m
[2m    - element is visible, enabled and stable[22m
[2m    - scrolling into view if needed[22m


### Domain Audit

```json
{}
```

### Issues

- fail: proof - locator.click: Timeout 30000ms exceeded.
Call log:
[2m  - waiting for locator('[data-screen-panel="run"]')[22m
[2m    - locator resolved to <section class="gameStage" data-screen-panel="run" aria-label="Gold Rush 3D game">…</section>[22m
[2m  - attempting click action[22m
[2m    - waiting for element to be visible, enabled and stable[22m
[2m    - element is visible, enabled and stable[22m
[2m    - scrolling into view if needed[22m

- warn: proof - 99-failure screenshot failed: locator.screenshot: Timeout 4177.8840000000055ms exceeded.
Call log:
[2m  - taking element screenshot[22m
[2m  - waiting for fonts to load...[22m
[2m  - fonts loaded[22m
[2m  - attempting scroll into view action[22m
[2m    - waiting for element to be stable[22m


### Screenshots

- screenshots/live-state-audit/local/01-title-2026-07-01T02-01-31-350Z.png
- screenshots/live-state-audit/local/02-lobby-2026-07-01T02-01-31-350Z.png
- screenshots/live-state-audit/local/03-loading-yard-2026-07-01T02-01-31-350Z.png

### Videos

- output/live-state-audit-videos/local-2026-07-01T02-01-31-350Z/page@2310289ecf1c98b831dd1e9450d5d072.webm

