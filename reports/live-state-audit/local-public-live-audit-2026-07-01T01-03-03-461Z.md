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

URL: http://127.0.0.1:5177/NexusEngine-GoldRush/?publicSmoke=2026-07-01T01-03-03-461Z

### Steps

- passed: load-title (1116ms)
- passed: enter-lobby (1996ms)
- passed: start-loading-yard (5481ms)
- passed: walk-board-train (24469ms)
- passed: sample-camera-ground-motion (40946ms)
- passed: complete-results (1918ms)

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

- warn: runtime - 4 console warnings/errors captured

### Screenshots

- screenshots/live-state-audit/local/01-title-2026-07-01T01-03-03-461Z.png
- screenshots/live-state-audit/local/02-lobby-2026-07-01T01-03-03-461Z.png
- screenshots/live-state-audit/local/03-loading-yard-2026-07-01T01-03-03-461Z.png
- screenshots/live-state-audit/local/04-gold-field-2026-07-01T01-03-03-461Z.png
- screenshots/live-state-audit/local/05-motion-sampled-2026-07-01T01-03-03-461Z.png
- screenshots/live-state-audit/local/06-results-2026-07-01T01-03-03-461Z.png

### Videos

- output/live-state-audit-videos/local-2026-07-01T01-03-03-461Z/page@2f30ecbe393535a9bc3325faa8f19eaa.webm

## public

Status: passed

URL: https://luminarylabs-dev.github.io/NexusEngine-GoldRush/?publicSmoke=2026-07-01T01-03-03-461Z

### Steps

- passed: load-title (2981ms)
- passed: enter-lobby (1682ms)
- passed: start-loading-yard (5400ms)
- passed: walk-board-train (18782ms)
- passed: sample-camera-ground-motion (44577ms)
- passed: complete-results (1754ms)

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

- screenshots/live-state-audit/public/01-title-2026-07-01T01-03-03-461Z.png
- screenshots/live-state-audit/public/02-lobby-2026-07-01T01-03-03-461Z.png
- screenshots/live-state-audit/public/03-loading-yard-2026-07-01T01-03-03-461Z.png
- screenshots/live-state-audit/public/04-gold-field-2026-07-01T01-03-03-461Z.png
- screenshots/live-state-audit/public/05-motion-sampled-2026-07-01T01-03-03-461Z.png
- screenshots/live-state-audit/public/06-results-2026-07-01T01-03-03-461Z.png

### Videos

- output/live-state-audit-videos/public-2026-07-01T01-03-03-461Z/page@0f9487dedb77fc49409066b418b0b8f2.webm

