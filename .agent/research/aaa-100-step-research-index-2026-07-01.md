# AAA 100-Step Research Index

Status: active
Date: 2026-07-01

## Purpose

This index defines how the 100-step roadmap expands into research packets, implementation packets, validation packets, and restart-with-new-knowledge packets.

## Research Sources Used In This Pass

- GitHub Game Engines collection: production surface checklist for scene, render, physics, asset, tooling, and platform architecture.
- PUBG overview: battle royale land, loot, survive, shrinking danger, training, and squad mode expectations.
- Apex Legends Knockout event: 60-player, 20-squad objective battle royale pressure and finale structure.
- Fortnite store page: squad identity, mode variety, no-build spatial skill, tighter 40-player mode framing, and movement literacy.
- Hunt Showdown bounty extract event: extraction progress, bounty value, visibility, and reward framing.

## Packet Template

Every roadmap research packet should use this shape:

```txt
# <Step ID> <Step Name>

Status: draft | active | resolved | replaced

## Question
What unknown does this packet answer?

## Current Repo Evidence
Which files, validators, proofs, and screenshots define the current truth?

## External References
Which game, engine, asset, UX, or platform references are relevant?

## Domain Owner
Which domain owns the result?

## Kit Impact
Which generic incubator kit or GoldRush custom kit changes?

## Data Contract
What minimal data should be public?

## Internal Work
What should happen behind private/internal APIs?

## Player-View Acceptance
What must the player see, hear, or feel?

## Edge Cases
What breaks at scale, with bad input, after restart, or during deploy?

## Validation
Which CLI, simulator, Playwright, screenshot, video, or public proof verifies it?
```

## Research Expansion Strategy

```txt
aaa-100-step-roadmap
|-- 100 step packets
|   |-- intent
|   |-- current evidence
|   |-- reference research
|   |-- data contract
|   |-- player view
|   |-- edge cases
|   |-- validation
|   `-- deploy risk
`-- optional child packets
    |-- asset-specific packets
    |-- interaction-specific packets
    |-- camera-angle packets
    |-- terrain-chunk packets
    |-- LOD-budget packets
    |-- network-snapshot packets
    `-- proof-scenario packets
```

This can become thousands of `.md` files when needed, but the first useful layer is the 100-step roadmap plus the audit and simulation packets. Do not generate thousands of empty files before each packet has a concrete question.

## Packet Folder

The first packet expansion now lives in:

```txt
.agent/research/aaa-100/
|-- README.md
|-- data-matrix.md
|-- continuous-audit-index.md
`-- 001-100 step packets
```

Each step packet records the current evidence, reference research lane, domain owner, kit impact, data contract, player-view acceptance, edge cases, research step, simulation gate, and validation expectation.

## Immediate Research Packet Priorities

1. `.agent/research/aaa-100/021-terrain-intention-map.md`: define the playable map before writing terrain code.
2. `.agent/research/aaa-100/022-top-down-terrain-plate.md`: define the drawn source format.
3. `.agent/research/aaa-100/023-height-mask-data-model.md`: make visual terrain, collider, routes, gold, and extraction share one data source.
4. `.agent/research/aaa-100/040-prop-protokit-library.md`: convert individual object scatter into readable object kits.
5. `.agent/research/aaa-100/050-exploration-camera-complete.md`: keep camera authority single and stable.
6. `.agent/research/aaa-100/084-bot-fill-single-player-staging.md`: make 60-player design testable from one browser.
7. `.agent/research/aaa-100/089-playwright-human-view-suite.md`: keep screenshots as the main player-view truth.
