# Workflow

Status: active

## Purpose

Coordinate GoldRush work through repo-local agent files before broad implementation changes.

## Rules

- Read `goal.md`, `memory.md`, and `.agent/START_HERE.md` before changing direction.
- Keep local edits inside `NexusEngine-GoldRush`.
- Treat legacy Unity repos and other kit repos as cloud/GPT-it source inputs unless the user explicitly changes that rule.
- Track feedback in `.agent/feedback/`.
- Track market, AAA, and player-experience gaps in `.agent/research/`.
- Append one-line entries to `.agent/change-log.md` for meaningful repo or agent workspace changes.
- Prefer Playwright, NexusSimulator, validators, and browser-visible proof before claiming a game loop improvement.

