# Legacy Unity Element Inventory

## Source Boundary

This is a GPT-it/cloud-side inventory of GitHub-visible Unity YAML and C# evidence. Local Codex did not clone the legacy repos and did not copy raw Unity assets.

Raw legacy files still need private pre-public scanning before they can enter `raw/imported/`.

## Terrain, Mountains, And Horizon Blockers

Files searched:

```txt
GoldRush_Old/Assets/_GOLDRUSH/08_Terrain/Terrain.prefab
GoldRush_Old/Assets/_GOLDRUSH/08_Terrain/TerrainLayers/Road.terrainlayer
GoldRush_Old/Assets/_GOLDRUSH/08_Terrain/TerrainLayers/Ground.terrainlayer
GoldRush_Old/Assets/_GOLDRUSH/08_Terrain/TerrainLayers/Grass.terrainlayer
GoldRush_Old/Assets/_GOLDRUSH/08_Terrain/TerrainLayers/Black.terrainlayer
GoldRush/Assets/World/Environment/Rock*.prefab
GoldRush_Old/Assets/_GOLDRUSH/02_Prefabs/Environment/RockFormations/*.prefab
```

Evidence:

- Old `Terrain.prefab` has Unity `Terrain` and `TerrainCollider` components.
- Root object is named `Terrain` and is positioned near `x=-100`, `y=0.6`, `z=-100`.
- Child terrain is also near `x=-100`, `y=0`, `z=-100`.
- Terrain settings include heightmap drawing, pixel error, splat map distance, tree distance, and detail distance.
- Road, Ground, Grass, and Black terrain layers exist.
- No explicit Mountain/Mesa/Cliff/Ridge assets were confirmed; rock and border formations are the current horizon-blocker evidence.

GoldRush-local expansion:

- `goldrush-terrain-patch-kit`
- `goldrush-terrain-stitch-kit`
- `goldrush-horizon-blocker-kit`
- Current local owner: `engine.n.goldrushWorld` plus `goldrush.procTerrain.patchTessellation`.

## Rocks, Cactus, Rail, And Cover Props

Files searched:

```txt
GoldRush/Assets/World/Environment/Rock01.prefab ... Rock14.prefab
GoldRush_Old/Assets/_GOLDRUSH/02_Prefabs/Environment/RockFormations/*.prefab
GoldRush/Assets/World/ImportedModels/Wild West Western/Models/Cactus_01.fbx ... Cactus_04.fbx
GoldRush_Old/Assets/_GOLDRUSH/02_Prefabs/Environment/Flora/*.prefab
GoldRush/Assets/World/ImportedModels/Wild West Western/Models/Fence_01.fbx
GoldRush/Assets/World/ImportedModels/Wild West Western/Models/Tracks_90.fbx
GoldRush_Old/Assets/_GOLDRUSH/02_Prefabs/Environment/Sets/FallenWagonScene.prefab
```

Evidence:

- Modern project has rock prefabs `Rock01.prefab` through `Rock14.prefab`.
- Old project has `RockFormation1.prefab`, `RockFormation2.prefab`, `RockFormation3.prefab`, `BorderFormation.prefab`, `BorderRock2.prefab`, and `Mine.prefab`.
- Cactus candidates exist as `Cactus_01.fbx` through `Cactus_04.fbx`.
- Old flora includes `CactiCluster1.prefab`, `NaturalCluster.prefab`, and `NaturalCluster2.prefab`.
- Rail/cover evidence includes `Tracks_90.fbx` and `Fence_01.fbx`.

GoldRush-local expansion:

- `goldrush-desert-scatter-kit`
- `goldrush-cover-prop-kit`
- `goldrush-rail-prop-kit`
- Current local descriptor: `scatterFields` in `src/content/goldrushWorldElements.js`.

## Structures, Towns, And Landmarks

Files searched:

```txt
GoldRush/Assets/World/Buildings/Saloon.prefab
GoldRush/Assets/World/ImportedModels/Wild West Western/Models/Saloon.fbx
GoldRush/Assets/World/Location/Town01.prefab
GoldRush/Assets/World/Location/Town02.prefab
GoldRush/Assets/World/Location/Town03.prefab
GoldRush/Assets/Entities/Vehicles/TrainEntity.prefab
GoldRush/Assets/Entities/LobbyTrainCar02.prefab
GoldRush_Old/Assets/_GOLDRUSH/02_Prefabs/Environment/Sets/Town-1-Layout.prefab
GoldRush_Old/Assets/_GOLDRUSH/02_Prefabs/Environment/Sets/Town-2-Layout.prefab
```

Evidence:

- `Saloon.prefab`, `Saloon.fbx`, and `Saloon.mat` exist.
- Modern town layout prefabs exist: `Town01.prefab`, `Town02.prefab`, `Town03.prefab`.
- Old town layout prefabs exist: `Town-1-Layout.prefab`, `Town-2-Layout.prefab`.
- Train/lobby anchors exist through `TrainEntity.prefab` and `LobbyTrainCar02.prefab`.
- Town evidence includes placed objects such as `House04 (3)`, `House01`, `Chapel`, `House01 (3)`, `House04 (2)`, `House01 (1)`, and `Church`.
- Example coordinates from `Town01.prefab` include `House04 (3)` around `x=-35.9`, `z=25.4`, `House01` around `x=16.33052`, `z=-29.423828`, and `Chapel` around `x=-35.600006`, `z=24`.
- A clean station asset name was not confirmed, but train/lobby assets imply station-like settlement anchors.

GoldRush-local expansion:

- `goldrush-town-layout-kit`
- `goldrush-settlement-landmark-kit`
- `goldrush-town-transition-kit`
- `goldrush-town-prop-registry-kit`
- Current local descriptor: `towns` and `landmarks` in `src/content/goldrushWorldElements.js`.

## Gold Zones And Mining Nodes

Files searched:

```txt
GoldRush_Old/Assets/_GOLDRUSH/01_Scripts/Gold/GoldPile.cs
GoldRush_Old/Assets/_GOLDRUSH/01_Scripts/Gold/GoldPileSpawner.cs
GoldRush_Old/Assets/_GOLDRUSH/02_Prefabs/Pile O' Gold SpawnArea.prefab
GoldRush/Assets/World/ImportedModels/Wild West Western/Models/Coin_01.fbx
GoldRush/Assets/World/ImportedModels/Wild West Western/Models/Coin_02.fbx
```

Evidence:

- `GoldPile` has serialized `goldAmount = 10f`.
- Interacting with a local player calls `player.AddGold(goldAmount)` and destroys the object.
- `GoldPileSpawner` has `goldPilePrefab`, `spawnRate = 1f`, networked `numberOfPlayersInSpawner`, and networked `isSpawningGold`.
- Spawning uses `Runner.Spawn(goldPilePrefab, GetRandomePointInInteractionArea(), transform.rotation)`.
- `Pile O' Gold SpawnArea.prefab` exists.
- Coin model candidates exist: `Coin_01.fbx`, `Coin_02.fbx`.

GoldRush-local expansion:

- `goldrush-gold-zone-kit`
- `goldrush-mining-kit`
- `goldrush-cargo-kit`
- `goldrush-cashout-kit`
- Current local descriptor: `goldZones` plus existing mining/cargo/cashout kits.

## Loading, Lobby, And Matchmaking

Files searched:

```txt
GoldRush/ProjectSettings/EditorBuildSettings.asset
GoldRush/Assets/Networking/MatchmakingHandler.cs
GoldRush_Old/ProjectSettings/EditorBuildSettings.asset
GoldRush_Old/Assets/_GOLDRUSH/01_Scripts/MainMenuManager.cs
GoldRush_Old/Assets/_GOLDRUSH/01_Scripts/LobbyManager.cs
```

Evidence:

- Modern build settings include `Assets/Scenes/Lobby.unity` and `Assets/Scenes/Arena.unity`.
- Old build settings include `Assets/_GOLDRUSH/00_Scenes/MainMenu.unity` and `Assets/_GOLDRUSH/00_Scenes/Game.unity`.
- `MainMenuManager` listens for a join button and loads `Game` through `SceneManager.LoadScene("Game")`.
- `MatchmakingHandler` starts local Fusion, has `targetPlayerCount = 20`, updates queue status, and loads Arena when the player count target is reached.
- `LobbyManager` joins Fusion lobbies/sessions, waits for sessions, creates/joins sessions, sorts by player count, and supports leave behavior.

GoldRush-local expansion:

- `goldrush-scene-transition-kit`
- `goldrush-room-lobby-kit`
- `goldrush-loading-state-kit`
- Current local owner: `engine.n.goldrushScenes`, `engine.n.goldrushRooms`, and `engine.n.goldrushWorld.loadingGates`.

## Room Patches And World Partitioning

Files searched:

```txt
GoldRush_Old/Assets/_GOLDRUSH/08_Terrain/Terrain.prefab
GoldRush/Assets/Networking/MatchmakingHandler.cs
GoldRush_Old/Assets/_GOLDRUSH/01_Scripts/LobbyManager.cs
GoldRush/Assets/World/Location/Town01.prefab
GoldRush/Assets/World/Location/Town02.prefab
GoldRush/Assets/World/Location/Town03.prefab
```

Evidence:

- Old terrain is rooted near `x=-100`, `z=-100`.
- Modern matchmaking target is `20`, but the rebuild target is 2-100 players with 50-player room shards.
- Old lobby logic searches up to 5 lobbies and sorts sessions by player count.
- Town prefabs provide local layout scale in tens of meters.

GoldRush-local expansion:

- `goldrush-room-patch-window-kit`
- `goldrush-room-handoff-kit`
- `goldrush-world-layout-kit`
- Current local descriptor: `roomPatchWindows` and `loadingGates`.

## Paths, Roads, Tracks, And Choke Points

Files searched:

```txt
GoldRush_Old/Assets/_GOLDRUSH/08_Terrain/TerrainLayers/Road.terrainlayer
GoldRush/Assets/World/ImportedModels/Wild West Western/Models/Tracks_90.fbx
GoldRush/Assets/Entities/Vehicles/TrainEntity.prefab
GoldRush/Assets/World/ImportedModels/Wild West Western/Models/Fence_01.fbx
GoldRush/Assets/World/Environment/Rock*.prefab
GoldRush_Old/Assets/_GOLDRUSH/02_Prefabs/Environment/RockFormations/*.prefab
```

Evidence:

- Road terrain layer exists.
- Track model `Tracks_90.fbx` exists.
- `TrainEntity.prefab` exists.
- Fence and rock props exist and can become path readable cover or choke-point blockers.

GoldRush-local expansion:

- `goldrush-path-network-kit`
- `goldrush-extraction-route-kit`
- `goldrush-choke-point-kit`
- Current local descriptor: `paths`.

## Audio States

Files searched:

```txt
GoldRush_Old/Assets/_GOLDRUSH/01_Scripts/MusicManager.cs
GoldRush_Old/Assets/_GOLDRUSH/06_Audio/GameAudio.mixer
GoldRush_Old/Assets/_GOLDRUSH/02_Prefabs/MusicManager.prefab
GoldRush_Old/Assets/_GOLDRUSH/01_Scripts/Player/PlayerController.cs
```

Evidence:

- `MusicManager` defines `MusicState { Wandering, Combat, Boss }`.
- It uses `AudioSource`, arrays for wandering/combat/boss songs, `fade duration 5f`, and `FadeToNewSong()`.
- It switches to combat when the player facade reports `InCombat`.
- `PlayerController` references `shootAudioSource` and plays gunshot audio when the network gunshot property changes.

GoldRush-local expansion:

- `goldrush-audio-state-kit`
- `goldrush-audio-cue-kit`
- Current local slot IDs live in `src/content/goldrushPresentationSlots.js`.

## Animation States

Files searched:

```txt
GoldRush/Assets/Entities/Player/TheBossAnimationController.controller
GoldRush_Old/Assets/_GOLDRUSH/01_Scripts/Player/PlayerAnimationController.cs
GoldRush_Old/Assets/_GOLDRUSH/01_Scripts/Player/PlayerController.cs
```

Evidence:

- Modern animator includes states `Aim Jump`, `Aim Idle`, `Run`, `Idle`, `Aim Run`.
- Animator params include `IsRunning`, `IsJumping`, `IsAiming`, and `Blend`.
- Old animation script syncs `Speed` and `IsShooting`.
- Player states include `Idle`, `Moving`, `Dashing`, `Shooting`, `Dead`.
- Combat states include `Suspicious`, `InCombat`, `OutOfCombat`.

GoldRush-local expansion:

- `goldrush-animation-state-kit`
- `goldrush-player-pose-descriptor-kit`
- Current local slot IDs live in `src/content/goldrushPresentationSlots.js`.

## Camera And Perspective

Files searched:

```txt
GoldRush_Old/Assets/_GOLDRUSH/01_Scripts/Player/CameraController.cs
GoldRush_Old/Assets/_GOLDRUSH/01_Scripts/Player/PlayerDetector.cs
GoldRush_Old/Assets/_GOLDRUSH/01_Scripts/Player/PlayerController.cs
```

Evidence:

- `CameraController` has serialized fields for single-focus and multi-focus pan speed.
- It has `playerOutOfCombatSize = 20f`, `playerInCombatSizeMultiplier = 2.5f`, `sizeChangeSpeed = 5f`, `followSmoothTime = 0.3f`, and positional offset.
- It changes target orthographic size based on `player.InCombat` and `DistanceToCenterOfFight`, clamping between `10` and `30`.
- `PlayerDetector` calculates detector midpoints and distance to center of fight.
- `PlayerController` exposes `InCombat`, `DistanceToCenterOfFight`, and `PlayerDetectorMidPoint`.

GoldRush-local expansion:

- `goldrush-perspective-kit`
- `goldrush-combat-cluster-kit`
- `goldrush-camera-descriptor-kit`
- Current local owner: `engine.n.goldrushPerspective`.

## Prioritized Build Sequence

1. Massive terrain and room patch windows.
2. Towns and settlement anchors.
3. Landmarks, roads, tracks, and horizon blockers.
4. Gold zones and extraction economy.
5. Scatter and cover.
6. Audio, animation, and camera polish.
7. Private raw import and sanitized promotion.

## Import Risk

Do not import these into runtime or public assets:

```txt
Packages/manifest.json
Photon/Fusion folders or configs
DOTween/Demigiant
Odin/Sirenix
ProjectSettings
UserSettings
Library
Temp
Obj
Logs
Build
Builds
*.csproj
*.sln
.env
.npmrc
.upmconfig.toml
```

Raw Unity files are reference inputs only until a private cloud worker scans, classifies, converts, and promotes approved browser-ready outputs.
