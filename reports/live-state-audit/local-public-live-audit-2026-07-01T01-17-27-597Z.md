# GoldRush Local/Public Live Audit

Status: failed

## Comparison

```json
{
  "status": "different",
  "mismatches": [
    {
      "field": "sceneFlow.activeSites",
      "public": [
        "site.loading-yard",
        "site.gold-field",
        "site.results"
      ]
    },
    {
      "field": "camera.motionAuthoritySet",
      "public": [
        "transition-latched-player-follow"
      ]
    },
    {
      "field": "camera.perspectiveSet",
      "public": [
        "goldrush.camera.pose.0094"
      ]
    },
    {
      "field": "terrain.placement",
      "public": "downward-triangle-raycast"
    },
    {
      "field": "terrain.colliderPlacement",
      "public": "highest-visible-banded-triangle-hit"
    },
    {
      "field": "terrain.physicsEngine",
      "public": "cannon-es"
    },
    {
      "field": "network.launchedPlayers",
      "public": 20
    }
  ],
  "localStatus": "failed",
  "publicStatus": "passed"
}
```

## local

Status: failed

URL: http://127.0.0.1:5177/NexusEngine-GoldRush/?publicSmoke=2026-07-01T01-17-27-597Z

### Steps

- passed: load-title (2058ms)
- passed: enter-lobby (4372ms)
- passed: start-loading-yard (10267ms)
- failed: walk-board-train (42192ms) - failed to board train through camera-relative movement before timeout

### Domain Audit

```json
{}
```

### Issues

- fail: proof - failed to board train through camera-relative movement before timeout

### Screenshots

- screenshots/live-state-audit/local/01-title-2026-07-01T01-17-27-597Z.png
- screenshots/live-state-audit/local/02-lobby-2026-07-01T01-17-27-597Z.png
- screenshots/live-state-audit/local/03-loading-yard-2026-07-01T01-17-27-597Z.png
- screenshots/live-state-audit/local/99-failure-2026-07-01T01-17-27-597Z.png

### Videos

- output/live-state-audit-videos/local-2026-07-01T01-17-27-597Z/page@4e6fa77c5394bb46e9a0bdeb1afc09e4.webm

## public

Status: passed

URL: https://luminarylabs-dev.github.io/NexusEngine-GoldRush/?publicSmoke=2026-07-01T01-17-27-597Z

### Steps

- passed: load-title (1718ms)
- passed: enter-lobby (7791ms)
- passed: start-loading-yard (8211ms)
- passed: walk-board-train (53493ms)
- passed: sample-camera-ground-motion (99177ms)
- passed: complete-results (4400ms)

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
    "maxOneFrameGroundDelta": 0.0077,
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

- screenshots/live-state-audit/public/01-title-2026-07-01T01-17-27-597Z.png
- screenshots/live-state-audit/public/02-lobby-2026-07-01T01-17-27-597Z.png
- screenshots/live-state-audit/public/03-loading-yard-2026-07-01T01-17-27-597Z.png
- screenshots/live-state-audit/public/04-gold-field-2026-07-01T01-17-27-597Z.png
- screenshots/live-state-audit/public/05-motion-sampled-2026-07-01T01-17-27-597Z.png
- screenshots/live-state-audit/public/06-results-2026-07-01T01-17-27-597Z.png

### Videos

- output/live-state-audit-videos/public-2026-07-01T01-17-27-597Z/page@f71b957bdca071f6b2fb78f1f03abaca.webm

