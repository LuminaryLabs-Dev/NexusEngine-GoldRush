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

URL: http://127.0.0.1:5173/NexusEngine-GoldRush/?publicSmoke=2026-07-01T03-12-56-477Z

### Steps

- passed: load-title (3419ms)
- passed: enter-lobby (3897ms)
- passed: start-loading-yard (7840ms)
- passed: walk-board-train (53360ms)
- failed: sample-camera-ground-motion (65083ms) - step:sample-camera-ground-motion timed out after 65000ms

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

- warn: proof - run-stage-focus click skipped: locator.click: Timeout 3000ms exceeded.
Call log:
[2m  - waiting for locator('[data-screen-panel="run"]')[22m
[2m    - locator resolved to <section class="gameStage" data-screen-panel="run" aria-label="Gold Rush 3D game">…</section>[22m

- fail: proof - step:sample-camera-ground-motion timed out after 65000ms
- warn: proof - 05-motion-sampled screenshot failed: page.evaluate: Target page, context or browser has been closed

### Screenshots

- screenshots/live-state-audit/local/01-title-2026-07-01T03-12-56-477Z.png
- screenshots/live-state-audit/local/02-lobby-2026-07-01T03-12-56-477Z.png
- screenshots/live-state-audit/local/03-loading-yard-2026-07-01T03-12-56-477Z.png
- screenshots/live-state-audit/local/04-gold-field-2026-07-01T03-12-56-477Z.png

### Videos

- none

