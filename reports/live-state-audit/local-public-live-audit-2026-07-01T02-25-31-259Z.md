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

URL: http://127.0.0.1:5173/NexusEngine-GoldRush/?publicSmoke=2026-07-01T02-25-31-259Z

### Steps

- passed: load-title (1192ms)
- passed: enter-lobby (2655ms)
- passed: start-loading-yard (7014ms)
- passed: walk-board-train (27852ms)
- passed: sample-camera-ground-motion (27904ms)
- passed: complete-results (3881ms)

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

- warn: proof - 04-gold-field used webgl-canvas-data-url fallback: page.screenshot: Timeout 10000ms exceeded.
Call log:
[2m  - taking page screenshot[22m

- warn: proof - 05-motion-sampled used webgl-canvas-data-url fallback: page.screenshot: Timeout 10000ms exceeded.
Call log:
[2m  - taking page screenshot[22m

- warn: runtime - 4 console warnings/errors captured

### Screenshots

- screenshots/live-state-audit/local/01-title-2026-07-01T02-25-31-259Z.png
- screenshots/live-state-audit/local/02-lobby-2026-07-01T02-25-31-259Z.png
- screenshots/live-state-audit/local/03-loading-yard-2026-07-01T02-25-31-259Z.png
- screenshots/live-state-audit/local/04-gold-field-2026-07-01T02-25-31-259Z.png
- screenshots/live-state-audit/local/05-motion-sampled-2026-07-01T02-25-31-259Z.png
- screenshots/live-state-audit/local/06-results-2026-07-01T02-25-31-259Z.png

### Videos

- output/live-state-audit-videos/local-2026-07-01T02-25-31-259Z/page@6ea437fea9e9df577d57ce48d3ced4e1.webm

## public

Status: passed

URL: https://luminarylabs-dev.github.io/NexusEngine-GoldRush/?publicSmoke=2026-07-01T02-25-31-259Z

### Steps

- passed: load-title (3395ms)
- passed: enter-lobby (2002ms)
- passed: start-loading-yard (5983ms)
- passed: walk-board-train (21775ms)
- passed: sample-camera-ground-motion (5722ms)
- passed: complete-results (1895ms)

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

- none

### Screenshots

- screenshots/live-state-audit/public/01-title-2026-07-01T02-25-31-259Z.png
- screenshots/live-state-audit/public/02-lobby-2026-07-01T02-25-31-259Z.png
- screenshots/live-state-audit/public/03-loading-yard-2026-07-01T02-25-31-259Z.png
- screenshots/live-state-audit/public/04-gold-field-2026-07-01T02-25-31-259Z.png
- screenshots/live-state-audit/public/05-motion-sampled-2026-07-01T02-25-31-259Z.png
- screenshots/live-state-audit/public/06-results-2026-07-01T02-25-31-259Z.png

### Videos

- output/live-state-audit-videos/public-2026-07-01T02-25-31-259Z/page@70ccf4133ca8acb9656e7e16bf445fbb.webm

