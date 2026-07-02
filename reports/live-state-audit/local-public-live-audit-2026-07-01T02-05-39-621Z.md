# GoldRush Local/Public Live Audit

Status: passed

## Comparison

```json
{
  "status": "single-target",
  "notes": [
    "comparison requires both local and public"
  ]
}
```

## public

Status: passed

URL: https://luminarylabs-dev.github.io/NexusEngine-GoldRush/?publicSmoke=2026-07-01T02-05-39-621Z

### Steps

- passed: load-title (1494ms)
- passed: enter-lobby (3132ms)
- passed: start-loading-yard (6789ms)
- passed: walk-board-train (26733ms)
- passed: sample-camera-ground-motion (10734ms)
- passed: complete-results (2442ms)

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
    "yawDelta": 0.1008,
    "cameraRelativeWasd": true,
    "mouseLookDrivesCamera": true
  },
  "terrain": {
    "maxGroundMismatch": 0,
    "maxRenderGroundMismatch": 0,
    "maxOneFrameGroundDelta": 0.0051,
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

- screenshots/live-state-audit/public/01-title-2026-07-01T02-05-39-621Z.png
- screenshots/live-state-audit/public/02-lobby-2026-07-01T02-05-39-621Z.png
- screenshots/live-state-audit/public/03-loading-yard-2026-07-01T02-05-39-621Z.png
- screenshots/live-state-audit/public/04-gold-field-2026-07-01T02-05-39-621Z.png
- screenshots/live-state-audit/public/05-motion-sampled-2026-07-01T02-05-39-621Z.png
- screenshots/live-state-audit/public/06-results-2026-07-01T02-05-39-621Z.png

### Videos

- output/live-state-audit-videos/public-2026-07-01T02-05-39-621Z/page@080bc61a5948ec7a04d897d5a98d4c5b.webm

