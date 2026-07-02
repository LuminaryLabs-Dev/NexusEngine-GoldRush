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

URL: http://127.0.0.1:5177/NexusEngine-GoldRush/?publicSmoke=2026-07-01T02-07-25-910Z

### Steps

- passed: load-title (1106ms)
- passed: enter-lobby (1550ms)
- passed: start-loading-yard (5630ms)
- passed: walk-board-train (26437ms)
- passed: sample-camera-ground-motion (5441ms)
- passed: complete-results (1476ms)

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
    "yawDelta": 0.052,
    "cameraRelativeWasd": true,
    "mouseLookDrivesCamera": true
  },
  "terrain": {
    "maxGroundMismatch": 0,
    "maxRenderGroundMismatch": 0,
    "maxOneFrameGroundDelta": 0.005,
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

- warn: proof - 04-gold-field screenshot failed: locator.screenshot: Timeout 2716.6029999999955ms exceeded.
Call log:
[2m  - taking element screenshot[22m
[2m  - waiting for fonts to load...[22m
[2m  - fonts loaded[22m
[2m  - attempting scroll into view action[22m
[2m    - waiting for element to be stable[22m
[2m    - element is not visible[22m
[2m  - retrying scroll into view action[22m
[2m    - waiting for element to be stable[22m

- warn: runtime - 4 console warnings/errors captured

### Screenshots

- screenshots/live-state-audit/local/01-title-2026-07-01T02-07-25-910Z.png
- screenshots/live-state-audit/local/02-lobby-2026-07-01T02-07-25-910Z.png
- screenshots/live-state-audit/local/03-loading-yard-2026-07-01T02-07-25-910Z.png
- screenshots/live-state-audit/local/05-motion-sampled-2026-07-01T02-07-25-910Z.png
- screenshots/live-state-audit/local/06-results-2026-07-01T02-07-25-910Z.png

### Videos

- output/live-state-audit-videos/local-2026-07-01T02-07-25-910Z/page@6e4d4abbd2c769bf0dcc5c8c2b3c862b.webm

## public

Status: passed

URL: https://luminarylabs-dev.github.io/NexusEngine-GoldRush/?publicSmoke=2026-07-01T02-07-25-910Z

### Steps

- passed: load-title (3582ms)
- passed: enter-lobby (1608ms)
- passed: start-loading-yard (5454ms)
- passed: walk-board-train (21340ms)
- passed: sample-camera-ground-motion (6056ms)
- passed: complete-results (1318ms)

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
    "yawDelta": 0.052,
    "cameraRelativeWasd": true,
    "mouseLookDrivesCamera": true
  },
  "terrain": {
    "maxGroundMismatch": 0,
    "maxRenderGroundMismatch": 0,
    "maxOneFrameGroundDelta": 0.005,
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
[2m  - attempting click action[22m
[2m    - scrolling into view if needed[22m
[2m    - done scrolling[22m
[2m    - forcing action[22m
[2m    - performing click action[22m


### Screenshots

- screenshots/live-state-audit/public/01-title-2026-07-01T02-07-25-910Z.png
- screenshots/live-state-audit/public/02-lobby-2026-07-01T02-07-25-910Z.png
- screenshots/live-state-audit/public/03-loading-yard-2026-07-01T02-07-25-910Z.png
- screenshots/live-state-audit/public/04-gold-field-2026-07-01T02-07-25-910Z.png
- screenshots/live-state-audit/public/05-motion-sampled-2026-07-01T02-07-25-910Z.png
- screenshots/live-state-audit/public/06-results-2026-07-01T02-07-25-910Z.png

### Videos

- output/live-state-audit-videos/public-2026-07-01T02-07-25-910Z/page@696cf28d1164598317b0fee0708b97d1.webm

