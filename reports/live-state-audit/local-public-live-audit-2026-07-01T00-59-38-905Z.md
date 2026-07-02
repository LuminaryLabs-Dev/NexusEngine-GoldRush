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

URL: http://127.0.0.1:5177/NexusEngine-GoldRush/?publicSmoke=2026-07-01T00-59-38-905Z

### Steps

- passed: load-title (1395ms)
- passed: enter-lobby (3176ms)
- passed: start-loading-yard (6085ms)
- passed: walk-board-train (27410ms)
- passed: sample-camera-ground-motion (49869ms)
- passed: complete-results (1398ms)

### Domain Audit

```json
{
  "sceneFlow": {
    "title": "start",
    "lobby": "lobby",
    "loading": "loading",
    "run": "run",
    "activeSites": [
      "site.loading-yard",
      "site.gold-field"
    ]
  },
  "camera": {
    "motionAuthoritySet": [
      "transition-latched-player-follow"
    ],
    "perspectiveSet": [
      "goldrush.camera.pose.0094"
    ],
    "maxOneFrameCameraJump": 0.2262,
    "yawDelta": 0.1008,
    "cameraRelativeWasd": true,
    "mouseLookDrivesCamera": true
  },
  "terrain": {
    "maxGroundMismatch": 0,
    "maxRenderGroundMismatch": 0,
    "maxOneFrameGroundDelta": 0.0078,
    "placement": "downward-triangle-raycast",
    "colliderPlacement": "highest-visible-banded-triangle-hit",
    "physicsEngine": "cannon-es"
  },
  "interaction": {
    "trainBoardingAction": "board-train",
    "playerLockedToTrain": false
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

- warn: runtime - 4 console warnings/errors captured
- fail: match - results screen did not resolve to final status

### Screenshots

- screenshots/live-state-audit/local/01-title-2026-07-01T00-59-38-905Z.png
- screenshots/live-state-audit/local/02-lobby-2026-07-01T00-59-38-905Z.png
- screenshots/live-state-audit/local/03-loading-yard-2026-07-01T00-59-38-905Z.png
- screenshots/live-state-audit/local/04-gold-field-2026-07-01T00-59-38-905Z.png
- screenshots/live-state-audit/local/05-motion-sampled-2026-07-01T00-59-38-905Z.png
- screenshots/live-state-audit/local/06-results-2026-07-01T00-59-38-905Z.png

### Videos

- output/live-state-audit-videos/local-2026-07-01T00-59-38-905Z/page@e8c21451c02cdc9e48def929eda869a6.webm

## public

Status: failed

URL: https://luminarylabs-dev.github.io/NexusEngine-GoldRush/?publicSmoke=2026-07-01T00-59-38-905Z

### Steps

- passed: load-title (2669ms)
- passed: enter-lobby (1606ms)
- passed: start-loading-yard (6087ms)
- passed: walk-board-train (21966ms)
- passed: sample-camera-ground-motion (45709ms)
- passed: complete-results (3469ms)

### Domain Audit

```json
{
  "sceneFlow": {
    "title": "start",
    "lobby": "lobby",
    "loading": "loading",
    "run": "run",
    "activeSites": [
      "site.loading-yard",
      "site.gold-field"
    ]
  },
  "camera": {
    "motionAuthoritySet": [
      "transition-latched-player-follow"
    ],
    "perspectiveSet": [
      "goldrush.camera.pose.0094"
    ],
    "maxOneFrameCameraJump": 0.2262,
    "yawDelta": 0.1008,
    "cameraRelativeWasd": true,
    "mouseLookDrivesCamera": true
  },
  "terrain": {
    "maxGroundMismatch": 0,
    "maxRenderGroundMismatch": 0,
    "maxOneFrameGroundDelta": 0.0078,
    "placement": "downward-triangle-raycast",
    "colliderPlacement": "highest-visible-banded-triangle-hit",
    "physicsEngine": "cannon-es"
  },
  "interaction": {
    "trainBoardingAction": "board-train",
    "playerLockedToTrain": false
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

- fail: match - results screen did not resolve to final status

### Screenshots

- screenshots/live-state-audit/public/01-title-2026-07-01T00-59-38-905Z.png
- screenshots/live-state-audit/public/02-lobby-2026-07-01T00-59-38-905Z.png
- screenshots/live-state-audit/public/03-loading-yard-2026-07-01T00-59-38-905Z.png
- screenshots/live-state-audit/public/04-gold-field-2026-07-01T00-59-38-905Z.png
- screenshots/live-state-audit/public/05-motion-sampled-2026-07-01T00-59-38-905Z.png
- screenshots/live-state-audit/public/06-results-2026-07-01T00-59-38-905Z.png

### Videos

- output/live-state-audit-videos/public-2026-07-01T00-59-38-905Z/page@7650f6a32115beeaa210ab5bdb8aebd6.webm

