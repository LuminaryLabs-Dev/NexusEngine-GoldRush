# Workflow

Status: active

## Purpose

Coordinate GoldRush work through repo-local agent files before broad implementation changes.

## Core Loop

1. Read `AGENTS.md`, `.agent/start-here.md`, `.agent/agent-it-operating-contract.md`, repo `memory.md`, `.agent/goal.md`, and the relevant packet.
2. Read `.agent/version-rebuild-loop/README.md`, `current-version.md`, `version-matrix.md`, `promotion-rules.md`, and the newest version packet.
3. Identify the newest version before choosing work.
4. Audit the newest version for working, partial, fake/helper-only, broken, missing, stale, and bad-assumption areas.
5. Decide whether this turn should continue the newest version or increment to a new ground-up rebuild.
6. If continuing, pick the next atomic roadmap slice, identify the owning domain and kit, implement only that slice when implementation is allowed, and validate it.
7. If incrementing, create the next version packet and rebuild from validated parts, validated contracts, lessons, design docs, and roadmap goals only.
8. Update the version packet with source state, inherited validated parts, rejected parts, broken/fake/stale parts, lessons applied, current slice, validation, promotion decision, and next-turn recommendation.
9. Update the relevant `.agent` packet and append `.agent/change-log.md`.

## Rules

- Read `AGENTS.md`, `README.md`, `memory.md`, `.agent/start-here.md`, `.agent/agent-it-operating-contract.md`, `.agent/START_HERE.md`, and `.agent/goal.md` before changing direction.
- Do not skip the version audit.
- Do not blindly inherit the whole previous app.
- Do not patch the previous version just because it is nearby.
- Treat each version as a complete rebuild attempt that may take many turns.
- Continue the newest version by default when its audit says it is still a sound base.
- Increment only when the newest version is stuck, structurally wrong, overcomplicated, fake, or carrying bad assumptions.
- Keep local edits inside `NexusEngine-GoldRush`.
- Treat legacy Unity repos and other kit repos as cloud/GPT-it source inputs unless the user explicitly changes that rule.
- Track durable user feedback in `.agent/feedback-packets/`; keep older bug files in `.agent/feedback/`.
- Track market, AAA, and player-experience gaps in `.agent/research/`.
- Append one-line entries to `.agent/change-log.md` for meaningful repo or agent workspace changes.
- Prefer Playwright, NexusSimulator, validators, and browser-visible proof before claiming a game loop improvement.
- If implementation cannot safely continue, update the audit/version docs and stop.
- Keep responses concise and action-oriented: result, files changed, validation, next step.
- Do not add new unit or smoke test files unless the user asks; use existing validators/proof scripts first.

## Proof Defaults

- For regular local/public audits, run screenshot-first proof and retain reports under `reports/` and `screenshots/`.
- Use video only for motion diagnosis: pulsing, camera conflict, train timing, character grounding, and interaction timing.
- Run `proof:browser-doctor` first when browser control has recently hung.
- Do not use scratch `.playwright-cli/` captures as durable proof.
- Do not describe simulator proof as live multiplayer proof.
- Do not describe local proof as public proof.
- Do not treat candidate assets as approved runtime content.
- Do not carry helper-only, debug-only, renderer-only, stale, or fake proof into the next version.
- The version packet must name exactly what the current proof covers and what it does not cover.

## External Work

- Do not clone legacy Gold Rush, NexusRealtime, ProtoKits, Experiments, or other source repos locally for this goal.
- If external source movement is needed, ask GPT-it/cloud/GitHub-side work to move data into this repo through the existing raw/sanitized/review/promotion gates.
- When asking GPT-it to do work, first ask it to find/read/explain intent; only ask it to execute after the intent and scope are confirmed.

## UI/UX Work

- Keep hero actions first-screen only.
- Hide advanced/debug actions in foldouts or proof-only APIs.
- Classify required player actions as hero controls and optional/direct/debug actions as advanced controls.
- The lobby is a squad staging screen with a 3D character, party code controls, group type dropdown, and leader launch.
- The run scene should be immersive 3D; avoid persistent debug overlays as the primary player experience.
- Preserve GoldRush business logic and kit architecture, but choose the best interaction-based UI/UX for the game instead of copying another project's UI intention by default.
