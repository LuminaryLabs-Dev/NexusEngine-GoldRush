# Agent Goal

Status: active

## Objective

Advance `NexusEngine-GoldRush` toward a high-fidelity wild-west extraction battle royale using NexusRealtime, NexusRealtime-Kits, ProtoKits, GoldRush custom kits, approved legacy assets, and repeatable validation.

## Current End-State Definition

`NexusEngine-GoldRush` should become one browser-deployable Gold Rush game where both old Gold Rush Unity versions are represented through one unified game loop. The player starts at a title screen, enters a party lobby, boards a train, spawns into a large western gold field, moves with over-the-shoulder mouse-look controls, mines gold, carries cargo, faces pressure/combat, extracts at a cashout site, scores, and reaches results/replay.

The game should be powered by NexusRealtime as the runtime contract, reusable NexusRealtime-style incubator kits, imported ProtoKits where useful, and GoldRush custom kits for game-specific rules.

## Success Criteria

- The default branch can carry the stable game work.
- The `Build` branch deploys GitHub Pages.
- Legacy Gold Rush assets are copied, sanitized, reviewed, approved, and promoted through repo gates before runtime use.
- Both legacy game versions are represented as one unified game with perspective/mode shifts.
- The game loop is playable: title, lobby, train loading, spawn, move, mine, carry, combat pressure, extract, score, results.
- Agent research and feedback packets identify missing AAA, market, player, runtime, and content gaps before major passes.

## Current Goal Packets

- `.agent/goal-packets/01-end-state.md`
- `.agent/goal-packets/02-playable-loop.md`
- `.agent/goal-packets/03-asset-audio-pipeline.md`
- `.agent/goal-packets/04-proof-deploy-loop.md`

## Active Non-Negotiables

- Do not clone old source repos locally for this goal.
- Do not promote raw or sanitized assets into runtime without approval records.
- Do not treat internal shard structure as the main UX.
- Do not claim completion from a narrow proof if the full end state is still missing.
- Re-check previous changes after new feature work to make sure they still fit the current architecture and design patterns.
