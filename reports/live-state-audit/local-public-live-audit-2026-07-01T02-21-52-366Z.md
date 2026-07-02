# GoldRush Local/Public Live Audit

Status: failed

## Comparison

```json
{
  "status": "different",
  "mismatches": [
    {
      "field": "sceneFlow.activeSites",
      "local": [
        "site.loading-yard",
        "site.gold-field",
        "site.results"
      ]
    },
    {
      "field": "camera.motionAuthoritySet",
      "local": [
        "transition-latched-player-follow"
      ]
    },
    {
      "field": "camera.perspectiveSet",
      "local": [
        "goldrush.camera.pose.0094"
      ]
    },
    {
      "field": "terrain.placement",
      "local": "downward-triangle-raycast"
    },
    {
      "field": "terrain.colliderPlacement",
      "local": "highest-visible-banded-triangle-hit"
    },
    {
      "field": "terrain.physicsEngine",
      "local": "cannon-es"
    },
    {
      "field": "network.launchedPlayers",
      "local": 20
    }
  ],
  "localStatus": "passed",
  "publicStatus": "failed"
}
```

## local

Status: passed

URL: http://127.0.0.1:5173/NexusEngine-GoldRush/?publicSmoke=2026-07-01T02-21-52-366Z

### Steps

- passed: load-title (1110ms)
- passed: enter-lobby (1536ms)
- passed: start-loading-yard (5631ms)
- passed: walk-board-train (25636ms)
- passed: sample-camera-ground-motion (33877ms)
- passed: complete-results (12971ms)

### Domain Audit

```json
{
  "sceneFlow": {
    "title": "start",
    "lobby": "lobby",
    "loading": "loading",
    "run": "run",
    "results": "results",
    "activeSites": [
      "site.loading-yard",
      "site.gold-field",
      "site.results"
    ]
  },
  "camera": {
    "motionAuthoritySet": [
      "transition-latched-player-follow"
    ],
    "perspectiveSet": [
      "goldrush.camera.pose.0094"
    ],
    "maxOneFrameCameraJump": 0.1533,
    "yawDelta": 0.0358,
    "cameraRelativeWasd": true,
    "mouseLookDrivesCamera": true
  },
  "terrain": {
    "maxGroundMismatch": 0,
    "maxRenderGroundMismatch": 0,
    "maxOneFrameGroundDelta": 0.0048,
    "placement": "downward-triangle-raycast",
    "colliderPlacement": "highest-visible-banded-triangle-hit",
    "physicsEngine": "cannon-es"
  },
  "interaction": {
    "trainBoardingAction": "board-train",
    "playerLockedToTrain": false,
    "finalScreen": "results",
    "resultStatus": "final"
  },
  "network": {
    "partyStatus": "local",
    "capacity": 4,
    "members": 1,
    "launchedPlayers": 20
  },
  "audio": {
    "managerStatus": "started",
    "trainTransitionAudioContract": "goldrush-train-transition-audio-cues-v1"
  }
}
```

### Issues

- warn: proof - run-stage-focus click skipped: locator.click: Timeout 3000ms exceeded.
Call log:
[2m  - waiting for locator('[data-screen-panel="run"]')[22m
[2m    - locator resolved to <section class="gameStage" data-screen-panel="run" aria-label="Gold Rush 3D game">…</section>[22m

- warn: proof - 05-motion-sampled used webgl-canvas-data-url fallback: page.screenshot: Timeout 10000ms exceeded.
Call log:
[2m  - taking page screenshot[22m

- warn: runtime - 4 console warnings/errors captured

### Screenshots

- screenshots/live-state-audit/local/01-title-2026-07-01T02-21-52-366Z.png
- screenshots/live-state-audit/local/02-lobby-2026-07-01T02-21-52-366Z.png
- screenshots/live-state-audit/local/03-loading-yard-2026-07-01T02-21-52-366Z.png
- screenshots/live-state-audit/local/04-gold-field-2026-07-01T02-21-52-366Z.png
- screenshots/live-state-audit/local/05-motion-sampled-2026-07-01T02-21-52-366Z.png
- screenshots/live-state-audit/local/06-results-2026-07-01T02-21-52-366Z.png

### Videos

- output/live-state-audit-videos/local-2026-07-01T02-21-52-366Z/page@ec91ba73f90afc5574b8a5acc7ffd92f.webm

## public

Status: failed

URL: https://luminarylabs-dev.github.io/NexusEngine-GoldRush/?publicSmoke=2026-07-01T02-21-52-366Z

### Steps

- passed: load-title (6064ms)
- passed: enter-lobby (3895ms)
- passed: start-loading-yard (10552ms)
- failed: walk-board-train (45003ms) - step:walk-board-train timed out after 45000ms

### Domain Audit

```json
{}
```

### Issues

- warn: proof - run-stage-focus click skipped: locator.click: Timeout 3000ms exceeded.
Call log:
[2m  - waiting for locator('[data-screen-panel="run"]')[22m
[2m    - locator resolved to <section class="gameStage" data-screen-panel="run" aria-label="Gold Rush 3D game">…</section>[22m

- fail: proof - step:walk-board-train timed out after 45000ms

### Screenshots

- screenshots/live-state-audit/public/01-title-2026-07-01T02-21-52-366Z.png
- screenshots/live-state-audit/public/02-lobby-2026-07-01T02-21-52-366Z.png
- screenshots/live-state-audit/public/03-loading-yard-2026-07-01T02-21-52-366Z.png
- screenshots/live-state-audit/public/04-gold-field-2026-07-01T02-21-52-366Z.png
- screenshots/live-state-audit/public/99-failure-2026-07-01T02-21-52-366Z.png

### Videos

- output/live-state-audit-videos/public-2026-07-01T02-21-52-366Z/page@9a5cc3911a3a11b739b99bba3e4344d9.webm

