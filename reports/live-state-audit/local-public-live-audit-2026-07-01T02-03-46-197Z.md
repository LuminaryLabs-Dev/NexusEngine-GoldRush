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

## local

Status: passed

URL: http://127.0.0.1:5177/NexusEngine-GoldRush/?publicSmoke=2026-07-01T02-03-46-197Z

### Steps

- passed: load-title (1356ms)
- passed: enter-lobby (1669ms)
- passed: start-loading-yard (6424ms)
- passed: walk-board-train (27147ms)
- passed: sample-camera-ground-motion (18070ms)
- passed: complete-results (6683ms)

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

- warn: proof - 04-gold-field screenshot failed: locator.screenshot: Timeout 10000ms exceeded.
Call log:
[2m  - waiting for locator('canvas').last()[22m

- warn: runtime - 4 console warnings/errors captured

### Screenshots

- screenshots/live-state-audit/local/01-title-2026-07-01T02-03-46-197Z.png
- screenshots/live-state-audit/local/02-lobby-2026-07-01T02-03-46-197Z.png
- screenshots/live-state-audit/local/03-loading-yard-2026-07-01T02-03-46-197Z.png
- screenshots/live-state-audit/local/05-motion-sampled-2026-07-01T02-03-46-197Z.png
- screenshots/live-state-audit/local/06-results-2026-07-01T02-03-46-197Z.png

### Videos

- output/live-state-audit-videos/local-2026-07-01T02-03-46-197Z/page@8cf41ea213513efb1366638a7f73fdc9.webm

