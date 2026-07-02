# Version Rebuild Loop

Status: active docs-only
Current baseline: `v0.0.1`

## Purpose

Build GoldRush through strict full-version rebuild attempts until the newest version proves a working publishable game.

A version is a complete rebuild attempt from the ground up. It is not a patch on the previous app and it is not allowed to inherit the whole previous app by default.

## Core Rule

```txt
newest version = default work target
continue newest = audit says the base is still sound
increment version = audit says newest is stuck, flawed, fake, stale, overcomplicated, or carrying bad assumptions
```

Each new version may use only:

- validated parts
- validated contracts
- current lessons
- current design docs
- current roadmap goals

## Required Read Order

Every run reads:

1. `.agent/goal.md`
2. `.agent/workflow.md`
3. `.agent/version-rebuild-loop/README.md`
4. `.agent/version-rebuild-loop/current-version.md`
5. `.agent/version-rebuild-loop/version-matrix.md`
6. `.agent/version-rebuild-loop/promotion-rules.md`
7. `.agent/version-rebuild-loop/v0.0.1-baseline.md`
8. `.agent/goal-packets/05-aaa-100-step-roadmap.md`
9. `.agent/research/aaa-100/README.md`
10. `.agent/research/aaa-100/data-matrix.md`
11. `.agent/research/aaa-100/continuous-audit-index.md`
12. `.agent/research/aaa-100/lessons-matrix.md`

## Turn Loop

1. Identify the newest version.
2. Audit the newest version:
   - working
   - partial
   - fake/helper-only
   - broken
   - missing
   - stale
   - bad assumptions
3. Decide continue-or-increment.
4. If continuing, pick the next atomic roadmap slice and update only that slice.
5. If incrementing, create the next version packet and rebuild from the ground up.
6. Validate with the closest CLI, simulator, Playwright, browser proof, build, or direct inspection.
7. Update the version packet.
8. Update `lessons-matrix.md` only when a durable lesson changed.
9. Append `.agent/change-log.md`.
10. Stop.

## Required Version Packet Fields

Every version packet must record:

- source state
- inherited validated parts
- rejected parts
- broken/fake/stale parts
- lessons applied
- current implementation slice
- validation results
- promotion decision
- next-turn recommendation: continue or increment

Use `version-packet-template.md` when creating a new version packet.

## Current First Task

`v0.0.1` is the current prototype baseline.

Do not create `v0.0.2` until `v0.0.1` has a clear continue-or-increment decision.

The first implementation-facing task is to audit `v0.0.1` honestly, not to patch it blindly.

## Hard Rules

- Never promote unvalidated behavior.
- Never inherit the whole previous version blindly.
- Never describe simulator proof as live multiplayer proof.
- Never describe local proof as public proof.
- Never treat candidate assets as approved runtime content.
- Never carry helper-only, debug-only, renderer-only, stale, or fake proof forward.
- If a feature only works because of a test helper, it is not part of the rebuild.
- If the newest version is accumulating hacks, stop and create the next version.
- If implementation cannot safely continue, update audit/version docs and stop.

## Repeat Until

Keep improving or rebuilding versions until:

- `.agent/goal.md` success criteria are satisfied with current evidence.
- `.agent/goal-packets/05-aaa-100-step-roadmap.md` is represented by implemented, validated, versioned systems.
- `.agent/research/aaa-100/data-matrix.md` shows required roadmap goals complete, intentionally deferred, or superseded with documented reason.
- `.agent/research/aaa-100/lessons-matrix.md` captures durable lessons from failed, partial, fake, broken, stale, and promoted systems.
- `.agent/research/aaa-100/continuous-audit-index.md` has no unresolved critical fake-completion, player-view, public-proof, asset-approval, deployment, or architecture blocker.
- The newest version proves title -> lobby -> train -> gold field -> move -> mine -> carry -> combat pressure -> cashout -> score -> results.
- The game has single-player staging with bots.
- The game has honest 20/60-player simulation proof.
- The game has local and public browser proof.
- Runtime assets/audio are approved or explicitly documented as approved placeholders.
- No promoted system depends on helper-only, debug-only, renderer-only, stale, or fake proof.

## Relationship To The 100 Goals

The 100-goal roadmap owns the target. This folder owns how work advances without carrying bad assumptions forward.

Future implementation should pick one roadmap atom, bind it to the newest version packet, validate it, record lessons, and decide whether the next turn continues or increments.
