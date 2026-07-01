# Workflow

Status: active

## Purpose

Coordinate GoldRush work through repo-local agent files before broad implementation changes.

## Core Loop

1. Read `.agent/start-here.md`, repo `memory.md`, `.agent/goal.md`, and the relevant packet.
2. Identify the owning domain and kit before editing code.
3. Reuse or compose existing kits before creating a new one.
4. Keep local edits inside `NexusEngine-GoldRush`.
5. Validate with the closest existing validator, Playwright proof, simulator proof, build, or direct inspection.
6. Update the relevant `.agent` packet and append `.agent/change-log.md`.

## Rules

- Read `README.md`, `memory.md`, `.agent/start-here.md`, `.agent/START_HERE.md`, and `.agent/goal.md` before changing direction.
- Keep local edits inside `NexusEngine-GoldRush`.
- Treat legacy Unity repos and other kit repos as cloud/GPT-it source inputs unless the user explicitly changes that rule.
- Track durable user feedback in `.agent/feedback-packets/`; keep older bug files in `.agent/feedback/`.
- Track market, AAA, and player-experience gaps in `.agent/research/`.
- Append one-line entries to `.agent/change-log.md` for meaningful repo or agent workspace changes.
- Prefer Playwright, NexusSimulator, validators, and browser-visible proof before claiming a game loop improvement.

## Proof Defaults

- For regular local/public audits, run screenshot-first proof and retain reports under `reports/` and `screenshots/`.
- Use video only for motion diagnosis: pulsing, camera conflict, train timing, character grounding, and interaction timing.
- Run `proof:browser-doctor` first when browser control has recently hung.
- Do not use scratch `.playwright-cli/` captures as durable proof.

## External Work

- Do not clone legacy Gold Rush, NexusRealtime, ProtoKits, Experiments, or other source repos locally for this goal.
- If external source movement is needed, ask GPT-it/cloud/GitHub-side work to move data into this repo through the existing raw/sanitized/review/promotion gates.
- When asking GPT-it to do work, first ask it to find/read/explain intent; only ask it to execute after the intent and scope are confirmed.

## UI/UX Work

- Keep hero actions first-screen only.
- Hide advanced/debug actions in foldouts or proof-only APIs.
- The lobby is a squad staging screen with a 3D character, party code controls, group type dropdown, and leader launch.
- The run scene should be immersive 3D; avoid persistent debug overlays as the primary player experience.
