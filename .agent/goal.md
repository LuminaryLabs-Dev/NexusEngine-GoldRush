# Agent Goal

Status: active

## Objective

Advance `NexusEngine-GoldRush` toward a high-fidelity wild-west extraction battle royale using NexusRealtime, NexusRealtime-Kits, ProtoKits, GoldRush custom kits, approved legacy assets, repeatable validation, and a strict full-version rebuild loop.

## Current End-State Definition

`NexusEngine-GoldRush` should become one browser-deployable Gold Rush game where both old Gold Rush Unity versions are represented through one unified game loop. The player starts at a title screen, enters a party lobby, boards a train, spawns into a large western gold field, moves with over-the-shoulder mouse-look controls, mines gold, carries cargo, faces pressure/combat, extracts at a cashout site, scores, and reaches results/replay.

The game should be powered by NexusRealtime as the runtime contract, reusable NexusRealtime-style incubator kits, imported ProtoKits where useful, and GoldRush custom kits for game-specific rules.

## Version Rebuild Loop

- Every turn starts from the newest version packet in `.agent/version-rebuild-loop/`.
- A version is a complete rebuild attempt from the ground up, not a patch on the previous app.
- The newest version continues by default unless the audit shows it is stuck, flawed, overcomplicated, fake, or carrying bad assumptions.
- A new version may inherit only validated parts, validated contracts, current lessons, current design docs, and current roadmap goals.
- `v0.0.1` is the current baseline and must get a clear continue-or-increment decision before `v0.0.2` exists.

## Success Criteria

- The default branch can carry the stable game work.
- The `Build` branch deploys GitHub Pages.
- The newest version packet proves the full non-test loop from title to results with current evidence.
- The version rebuild docs, design docs, data matrix, lessons matrix, and continuous audits point to actual systems and current proof.
- Legacy Gold Rush assets are copied, sanitized, reviewed, approved, and promoted through repo gates before runtime use.
- Both legacy game versions are represented as one unified game with perspective/mode shifts.
- The game loop is playable: title, lobby, train loading, spawn, move, mine, carry, combat pressure, extract, score, results.
- Single-player staging with bots is proven separately from simulated 20/60-player proof and any future live multiplayer proof.
- Agent research and feedback packets identify missing AAA, market, player, runtime, and content gaps before major passes.

## Current Goal Packets

- `.agent/goal-packets/01-end-state.md`
- `.agent/goal-packets/02-playable-loop.md`
- `.agent/goal-packets/03-asset-audio-pipeline.md`
- `.agent/goal-packets/04-proof-deploy-loop.md`
- `.agent/goal-packets/05-aaa-100-step-roadmap.md`

## Active Non-Negotiables

- Follow `AGENTS.md`, `.agent/start-here.md`, and `.agent/agent-it-operating-contract.md` before implementation, deploy, or push work.
- Do not clone old source repos locally for this goal.
- Do not promote raw or sanitized assets into runtime without approval records.
- Do not treat internal shard structure as the main UX.
- Do not claim completion from a narrow proof if the full end state is still missing.
- Do not implement a roadmap atom outside a version packet.
- Do not promote unvalidated behavior, helper-only proof, local-only proof, or candidate assets into the newest version.
- Re-check previous changes after new feature work to make sure they still fit the current architecture and design patterns.
