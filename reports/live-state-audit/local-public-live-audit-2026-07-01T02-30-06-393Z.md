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

URL: http://127.0.0.1:5173/NexusEngine-GoldRush/?publicSmoke=2026-07-01T02-30-06-393Z

### Steps

- passed: load-title (1541ms)
- passed: enter-lobby (3762ms)
- passed: start-loading-yard (6422ms)
- passed: walk-board-train (36095ms)
- passed: sample-camera-ground-motion (17651ms)
- passed: complete-results (3100ms)

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

- warn: proof - 05-motion-sampled used webgl-canvas-data-url fallback: page.screenshot: Timeout 10000ms exceeded.
Call log:
[2m  - taking page screenshot[22m

- warn: runtime - 4 console warnings/errors captured

### Screenshots

- screenshots/live-state-audit/local/01-title-2026-07-01T02-30-06-393Z.png
- screenshots/live-state-audit/local/02-lobby-2026-07-01T02-30-06-393Z.png
- screenshots/live-state-audit/local/03-loading-yard-2026-07-01T02-30-06-393Z.png
- screenshots/live-state-audit/local/04-gold-field-2026-07-01T02-30-06-393Z.png
- screenshots/live-state-audit/local/05-motion-sampled-2026-07-01T02-30-06-393Z.png
- screenshots/live-state-audit/local/06-results-2026-07-01T02-30-06-393Z.png

### Videos

- output/live-state-audit-videos/local-2026-07-01T02-30-06-393Z/page@af683b6f6078a2496693fd4c81490a7c.webm

