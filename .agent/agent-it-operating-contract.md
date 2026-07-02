# Agent-It Operating Contract

Status: active

## Purpose

Make a future "follow agent-it" instruction unambiguous for `NexusEngine-GoldRush`.

## Core Rule

Use the repo-local `.agent` workspace as the operating contract before any implementation, audit, validation, deploy, or push.

If the user says "follow agent-it", this contract means: read the repo-local agent workspace, identify the newest full-version rebuild attempt, audit it, then either improve that newest version or increment to the next ground-up version only when the audit proves the current one is no longer the best base.

In practice, that means a future agent should treat the current version packet plus its audit as the live operating target, not as background reading.

## Required Read List

Every run must read enough current repo-local state to answer: "What is the newest version, what does its audit say, and should this turn continue it or increment?"

Minimum required files:

1. `AGENTS.md`
2. `README.md`
3. `memory.md`
4. `.agent/start-here.md`
5. `.agent/agent-it-operating-contract.md`
6. `.agent/workflow.md`
7. `.agent/goal.md`
8. `.agent/version-rebuild-loop/README.md`
9. `.agent/version-rebuild-loop/current-version.md`
10. `.agent/version-rebuild-loop/version-matrix.md`
11. `.agent/version-rebuild-loop/promotion-rules.md`
12. `.agent/version-rebuild-loop/v0.0.1-baseline.md`
13. the newest version audit or packet named by `current-version.md`
14. `.agent/goal-packets/05-aaa-100-step-roadmap.md`
15. `.agent/research/aaa-100/README.md`
16. `.agent/research/aaa-100/data-matrix.md`
17. `.agent/research/aaa-100/continuous-audit-index.md`
18. `.agent/research/aaa-100/lessons-matrix.md`

## Turn Contract

1. Read the required files above and any directly referenced current packet.
2. Identify the newest version in `.agent/version-rebuild-loop/current-version.md`.
3. Audit the newest version before changing code or docs.
4. Decide one of two actions:
   - continue the newest version with one atomic roadmap slice.
   - increment to the next version only when the newest version is stuck, structurally wrong, fake, stale, overcomplicated, or hack-heavy.
5. If continuing, pick the next atomic roadmap slice and implement only that slice when implementation is allowed.
6. If incrementing, create the next patch version and rebuild from validated parts only.
7. Tie every slice to a domain, kit, data contract, validator, proof path, and player-facing outcome.
8. Validate with the closest existing CLI, simulator, Playwright, build, or direct inspection.
9. Update the relevant version packet, matrices, lessons, memory, and change log only when evidence supports the update.
10. Stop with a concise report: result, files changed, validation, next useful step.

## Durable Constraints

- Edit only `NexusEngine-GoldRush` unless the user explicitly changes scope.
- Do not clone external source repos locally for this goal.
- Do not implement outside the newest version packet.
- Do not promote raw, sanitized, candidate, helper-only, debug-only, renderer-only, stale, or fake systems.
- Do not treat local proof as public proof.
- Do not treat simulator proof as live multiplayer proof.
- Do not add new test files unless asked; prefer existing validators and proof scripts.
- Use Playwright and human-view proof for player-facing changes when practical.
- Keep reusable systems in generic incubator kits and GoldRush-specific rules in GoldRush custom kits.
- Keep UI hero actions first-screen; move advanced/debug actions into foldouts or proof-only surfaces.

## Version Rebuild Meaning

A version is a complete rebuild attempt from the ground up. It can take many turns. A turn should improve the newest version unless the audit proves the current version should be abandoned and rebuilt as the next version.

The version rule is not "one turn creates one version." The rule is "one turn updates the newest version, unless the newest version is no longer a sound base." New versions are allocated only when a continue-or-increment audit says to increment.

## Required Version Update

Every meaningful turn must update the active version packet or audit with:

- source state
- inherited validated parts
- rejected parts
- broken/fake/stale parts
- lessons applied
- current implementation slice
- validation results
- promotion decision
- next-turn recommendation: `continue` or `increment`

Update `.agent/research/aaa-100/lessons-matrix.md` only when a durable lesson changed. Always append `.agent/change-log.md` for meaningful repo or agent-workspace changes.

## Proof Boundary

Promoted proof must say what it proves and what it does not prove. Any missing public proof, asset approval, player-view proof, or multiplayer proof remains unresolved until validated directly.

## Repeat Until

Keep improving or rebuilding versions until current evidence proves:

- `.agent/goal.md` success criteria are satisfied.
- `.agent/goal-packets/05-aaa-100-step-roadmap.md` is represented by implemented, validated, versioned systems.
- `.agent/research/aaa-100/data-matrix.md` shows required roadmap goals complete, intentionally deferred, or superseded with documented reason.
- `.agent/research/aaa-100/lessons-matrix.md` captures durable lessons from failed, partial, fake, broken, stale, and promoted systems.
- `.agent/research/aaa-100/continuous-audit-index.md` has no unresolved critical fake-completion, player-view, public-proof, asset-approval, deployment, or architecture blocker.
- The newest version proves title -> lobby -> train -> gold field -> move -> mine -> carry -> combat pressure -> cashout -> score -> results.
- Single-player staging with bots is proven separately from honest 20/60-player simulation proof and any future live multiplayer proof.
- Local browser proof and public browser proof are current.
- Runtime assets/audio are approved or explicitly documented as approved placeholders.
- No promoted system depends on helper-only, debug-only, renderer-only, stale, or fake proof.
