# Scene, Audio, And Animation Contract

## Purpose

Gold Rush needs legacy scene, transition, audio, and animation intent before raw assets can safely land in this public repo.

This contract creates stable browser-facing slot IDs now. Cloud-side workers can later map sanitized legacy files into these slots after private pre-public scanning.

## Scene Slots

```txt
goldrush.scene.boot
goldrush.scene.loading
goldrush.scene.mainMenu
goldrush.scene.lobby
goldrush.scene.arena
goldrush.scene.playerTest
goldrush.scene.legacyGame
goldrush.scene.legacySinglePlayer
```

`goldrush.scene.arena` must render as a massive terrain field made from many small tessellated terrain patches. It must not read as a circular arena token.

## Transition Slots

```txt
goldrush.transition.bootToMainMenu
goldrush.transition.mainMenuToLobby
goldrush.transition.mainMenuToGame
goldrush.transition.lobbyToArena
goldrush.transition.loadingToArena
goldrush.transition.explorationToCombat
goldrush.transition.combatToExploration
goldrush.transition.combatToBoss
goldrush.transition.cashoutComplete
goldrush.transition.playerEliminated
goldrush.transition.roomHandoffStart
goldrush.transition.roomHandoffComplete
```

## Audio Slots

```txt
goldrush.audio.music.wandering
goldrush.audio.music.combat
goldrush.audio.music.boss
goldrush.audio.sfx.revolverShot
goldrush.audio.sfx.goldPickup
goldrush.audio.sfx.goldDrop
goldrush.audio.sfx.cashout
goldrush.audio.sfx.ambush
goldrush.audio.sfx.playerDown
goldrush.audio.bus.master
goldrush.audio.bus.music
goldrush.audio.bus.sfx
```

## Animation Slots

```txt
goldrush.anim.player.idle
goldrush.anim.player.run
goldrush.anim.player.dash
goldrush.anim.player.aimIdle
goldrush.anim.player.aimRun
goldrush.anim.player.aimJump
goldrush.anim.player.shooting
goldrush.anim.player.dead
goldrush.anim.state.speed
goldrush.anim.state.isShooting
goldrush.anim.state.isAiming
goldrush.anim.state.isRunning
goldrush.anim.state.isJumping
goldrush.anim.state.combatState
```

## Procedural Renderer Kits

GoldRush owns local procedural renderer kits under `src/renderer/`. These are placeholders until legacy assets are sanitized, but they must validate as real scene structure:

```txt
goldrush.procTerrain.patchTessellation
goldrush.procTerrain.routeRibbon
goldrush.procTerrain.goldNodeScatter
goldrush.procTerrain.shardPlayerMarkers
goldrush.procScene.lightingCamera
```

Validation runs each kit separately through:

```txt
node tools/validation/validate-procedural-renderer-kits.mjs
```

## Cloud Import Job

The next scene/audio/animation cloud import branch should be:

```txt
import/goldrush-scenes-audio-animation-001-raw-candidates
```

Required raw destination:

```txt
raw/imported/goldrush-scenes-audio-animation-001/source/
```

Required reports:

```txt
manifests/import-jobs/goldrush-scenes-audio-animation-001.json
reports/secret-scans/goldrush-scenes-audio-animation-001.json
reports/asset-classification/goldrush-scenes-audio-animation-001.json
reports/provenance/goldrush-scenes-audio-animation-001.md
```

## Rules

- These slots are IDs, not legacy source paths.
- No runtime slot may reference `raw/`, `quarantine/`, `sanitized/`, or the private legacy repo.
- Runtime code consumes slots through NexusRealtime state only.
- Cloud-side import must map actual legacy files to these slots in reports before promotion.
- Local Codex work may add kits only inside `NexusEngine-GoldRush`.

## Runtime Surface

The scene transition domain installs as:

```txt
engine.n.goldrushScenes
```

The scenario snapshot exposes:

```txt
state.sceneState.currentSceneId
state.sceneState.activeAudioCueId
state.sceneState.activeAnimationCueId
state.sceneState.lastTransition
```

Phase mapping:

```txt
lobby    -> goldrush.scene.lobby
drop     -> goldrush.scene.arena
prospect -> goldrush.scene.arena
combat   -> goldrush.scene.legacyGame
extract  -> goldrush.scene.arena
results  -> goldrush.scene.arena
```
