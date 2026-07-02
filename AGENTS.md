# Agent Instructions

## Global

- Maintain `memory.md` as the durable repo memory for purpose, architecture shape, and major conventions.
- Maintain `.agent/goal.md` as the live goal criteria and intent file.
- Update memory only when a lasting repo decision, architecture preference, design pattern, or user preference changes.
- Remove outdated memory instead of accumulating duplicate guidance.
- Keep chat replies short: result, files changed, validation, next step.
- Prefer Playwright and human-view proof when validating player-facing work.

## Required Agent-It Route

If you tell someone to "follow agent-it" in this repo, they should read the repo-local `.agent` workspace first, then follow the newest version packet and its audit instead of inventing a fresh plan.

Before changing direction, read:

1. `.agent/start-here.md`
2. `.agent/agent-it-operating-contract.md`
3. `.agent/workflow.md`
4. `.agent/goal.md`
5. `.agent/version-rebuild-loop/README.md`
6. `.agent/version-rebuild-loop/current-version.md`
7. `.agent/version-rebuild-loop/version-matrix.md`
8. `.agent/version-rebuild-loop/promotion-rules.md`
9. `.agent/version-rebuild-loop/v0.0.1-baseline.md`
10. the newest version audit or packet named by `.agent/version-rebuild-loop/current-version.md`
11. `.agent/goal-packets/05-aaa-100-step-roadmap.md`
12. `.agent/research/aaa-100/README.md`
13. `.agent/research/aaa-100/data-matrix.md`
14. `.agent/research/aaa-100/continuous-audit-index.md`
15. `.agent/research/aaa-100/lessons-matrix.md`

Then follow the newest version packet. Every implementation turn either improves the newest version or increments only when the newest version is stuck, structurally wrong, fake, stale, overcomplicated, or hack-heavy.

Every meaningful turn must update the active version packet or audit, update durable matrices/lessons only when evidence changed, and append `.agent/change-log.md`.

## Work Style

- Prefer completing the requested task over producing a long plan.
- Infer small requests from `memory.md`, `.agent/memory.md`, and the active version packet.
- Ask before destructive actions, major architecture changes, deployments, credential use, payments, or unclear product direction.
- Keep edits inside `NexusEngine-GoldRush` unless the user explicitly changes that rule.
- Do not clone legacy Gold Rush, NexusRealtime, ProtoKits, or other source repos locally for this goal.

## Coding

- Follow existing repo conventions before introducing new patterns.
- For multi-file edits, inspect related files first and make the smallest coherent change.
- Add or modify kits only through domain ownership: generic incubator kits for reusable behavior, GoldRush kits for game rules.
- Do not add new unit or smoke test files unless asked; do run existing relevant checks.
- Use web search when current external API/library behavior, industry standards, or missing repo guidance matters.

## Validation

- Prefer direct validation through CLI commands, app startup, existing scripts, Playwright, NexusSimulator, or browser proof.
- Do not claim local proof as public proof.
- Do not claim simulator proof as live multiplayer proof.
- Do not promote raw, sanitized, candidate, helper-only, debug-only, renderer-only, stale, or fake systems into the current version.
- If validation cannot run, state why and give the closest useful manual check.

## UX/UI

- Break UI/UX down by purpose and required player action.
- Classify required actions as hero controls or advanced controls.
- Keep only hero controls in the first screen.
- Put advanced and direct non-essential actions under dropdowns or foldout groups inside the main hero surface.
- For this game, the player-facing route is title -> lobby -> train -> gold field -> move -> mine -> carry -> pressure/combat -> cashout -> score -> results.
- Preserve business logic and kit architecture, but choose the best interaction-based UI/UX for GoldRush rather than copying another project by default.
