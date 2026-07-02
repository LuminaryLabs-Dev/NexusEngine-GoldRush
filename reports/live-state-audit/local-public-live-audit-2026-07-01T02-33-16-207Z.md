# GoldRush Local/Public Live Audit

Status: passed

## Comparison

```json
{
  "status": "matched",
  "mismatches": [],
  "localStatus": "passed",
  "publicStatus": "passed"
}
```

## local

Status: passed

URL: http://127.0.0.1:5173/NexusEngine-GoldRush/?publicSmoke=2026-07-01T02-33-16-207Z

### Steps

- passed: load-title (1287ms)
- passed: enter-lobby (3173ms)
- passed: start-loading-yard (8748ms)
- passed: walk-board-train (24989ms)
- passed: sample-camera-ground-motion (18201ms)
- passed: complete-results (1757ms)

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
    "maxOneFrameCameraJump": 0.1532,
    "yawDelta": 0.0293,
    "cameraRelativeWasd": true,
    "mouseLookDrivesCamera": true
  },
  "terrain": {
    "maxGroundMismatch": 0,
    "maxRenderGroundMismatch": 0,
    "maxOneFrameGroundDelta": 0.0046,
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

- warn: proof - 04-gold-field used webgl-canvas-data-url fallback: page.screenshot: Timeout 10000ms exceeded.
Call log:
[2m  - taking page screenshot[22m

- warn: proof - 05-motion-sampled used webgl-canvas-data-url fallback: page.screenshot: Timeout 10000ms exceeded.
Call log:
[2m  - taking page screenshot[22m

- warn: runtime - 4 console warnings/errors captured

### Screenshots

- screenshots/live-state-audit/local/01-title-2026-07-01T02-33-16-207Z.png
- screenshots/live-state-audit/local/02-lobby-2026-07-01T02-33-16-207Z.png
- screenshots/live-state-audit/local/03-loading-yard-2026-07-01T02-33-16-207Z.png
- screenshots/live-state-audit/local/04-gold-field-2026-07-01T02-33-16-207Z.png
- screenshots/live-state-audit/local/05-motion-sampled-2026-07-01T02-33-16-207Z.png
- screenshots/live-state-audit/local/06-results-2026-07-01T02-33-16-207Z.png

### Videos

- output/live-state-audit-videos/local-2026-07-01T02-33-16-207Z/page@c7b929a21ca4807f154e02d8377b02e0.webm

## public

Status: passed

URL: https://luminarylabs-dev.github.io/NexusEngine-GoldRush/?publicSmoke=2026-07-01T02-33-16-207Z

### Steps

- passed: load-title (2682ms)
- passed: enter-lobby (2064ms)
- passed: start-loading-yard (5534ms)
- passed: walk-board-train (37403ms)
- passed: sample-camera-ground-motion (7841ms)
- passed: complete-results (9483ms)

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
    "maxOneFrameCameraJump": 0,
    "yawDelta": 0.0293,
    "cameraRelativeWasd": true,
    "mouseLookDrivesCamera": true
  },
  "terrain": {
    "maxGroundMismatch": 0,
    "maxRenderGroundMismatch": 0,
    "maxOneFrameGroundDelta": 0.0046,
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


### Screenshots

- screenshots/live-state-audit/public/01-title-2026-07-01T02-33-16-207Z.png
- screenshots/live-state-audit/public/02-lobby-2026-07-01T02-33-16-207Z.png
- screenshots/live-state-audit/public/03-loading-yard-2026-07-01T02-33-16-207Z.png
- screenshots/live-state-audit/public/04-gold-field-2026-07-01T02-33-16-207Z.png
- screenshots/live-state-audit/public/05-motion-sampled-2026-07-01T02-33-16-207Z.png
- screenshots/live-state-audit/public/06-results-2026-07-01T02-33-16-207Z.png

### Videos

- output/live-state-audit-videos/public-2026-07-01T02-33-16-207Z/page@bc3fb790d94a682ad63d0980ba40162f.webm

