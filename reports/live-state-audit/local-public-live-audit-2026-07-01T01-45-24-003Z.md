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

URL: http://127.0.0.1:5177/NexusEngine-GoldRush/?publicSmoke=2026-07-01T01-45-24-003Z

### Steps

- passed: load-title (1331ms)
- passed: enter-lobby (2295ms)
- passed: start-loading-yard (7099ms)
- passed: walk-board-train (36501ms)
- failed: sample-camera-ground-motion (11800ms) - page.evaluate: Error: motion sampling exceeded 10000ms
    at eval (eval at evaluate (:303:30), <anonymous>:29:15)
    at async <anonymous>:329:30

### Domain Audit

```json
{}
```

### Issues

- fail: proof - page.evaluate: Error: motion sampling exceeded 10000ms
    at eval (eval at evaluate (:303:30), <anonymous>:29:15)
    at async <anonymous>:329:30

### Screenshots

- screenshots/live-state-audit/local/01-title-2026-07-01T01-45-24-003Z.png
- screenshots/live-state-audit/local/02-lobby-2026-07-01T01-45-24-003Z.png
- screenshots/live-state-audit/local/03-loading-yard-2026-07-01T01-45-24-003Z.png
- screenshots/live-state-audit/local/04-gold-field-2026-07-01T01-45-24-003Z.png
- screenshots/live-state-audit/local/99-failure-2026-07-01T01-45-24-003Z.png

### Videos

- output/live-state-audit-videos/local-2026-07-01T01-45-24-003Z/page@c48fa54c3a071c2393fd734eace4d7c5.webm

