# GPT Cloud Workstream

## High-Mode Prompt Result

GPT-it was switched to High thinking mode and asked to inspect GitHub-visible sources for:

- `LuminaryLabs-Dev/NexusRealtime`
- NexusRealtime Kits sources
- `LuminaryLabs-Agents/NexusRealtime-ProtoKits`
- `LuminaryLabs-Dev/NexusEngine-GoldRush`
- `thecrimsondeveloper/Gold_Rush`

## Source Findings

- `NexusRealtime` is the runtime contract: ECS, events, resources, deterministic ticks, surfaces, snapshots, and kit installation.
- `NexusRealtime-ProtoKits` is the reusable domain proving ground before promotion into core.
- GPT did not find an exact populated `NexusRealtime-Kits` repo. It found a likely misspelled/minimal `LuminaryLabs-Dev/NexusRealitime-Kits`; use NexusRealtime and ProtoKits as the reliable kit sources until a real kits repo is confirmed.
- Remote `NexusEngine-GoldRush` default branch was README-only before this local scaffold lands.
- Legacy `thecrimsondeveloper/Gold_Rush` contains two Unity projects:
  - `GoldRush/`, Unity `6000.0.37f1`
  - `GoldRush_Old/`, Unity `2022.3.5f1`

## Public Repo Asset Rule

`NexusEngine-GoldRush` is public, so `raw/imported/` is not a private quarantine. Cloud-side transfer must run a pre-public secret/deny scan before any legacy file is pushed into this repo.

## Cloud-Side Asset Movement

Cloud workers may copy only pre-scanned candidate assets into:

```txt
raw/imported/<jobId>/
```

They must not copy blocked files, secrets, manifests, Photon/Fusion configs, Unity generated folders, or unclear third-party plugin folders.

Allowed first-pass candidates should focus on Gold Rush identity:

- trains and train cars.
- revolver and player/prospector references.
- cactus/desert/western props.
- coins/gold pile/pile spawn area.
- arena/lobby/game scene files as layout references only.
- old gold/mining/player/camera scripts as design references only.

## PR Sequence From GPT

1. Local scaffold integration.
2. Import tooling contract.
3. Source-side preflight report, with no raw assets.
4. Raw imported approved candidates only.
5. Classification and sanitation.
6. Converted asset registry.
7. Human-reviewed promotion into `public/assets`.
8. NexusRealtime/ProtoKit game loop implementation.
9. Build branch deploy.

## Validation Gates

- `npm run check` must pass.
- Runtime source must not reference `raw/`, `quarantine/`, or legacy repo paths.
- Every promoted asset needs source hash, output hash, provenance, approval id, and runtime path.
- Build output must not contain raw Unity files or secrets.
- Room orchestration must prove 2-50 players as one shard and 51-100 as two shards.
