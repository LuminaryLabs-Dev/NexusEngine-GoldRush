# 021.010 Spawn Safety Rings

Status: atomic-planned
Parent: 021 Terrain intention map
Domain: world
Owning kit candidate: `n:goldrush:authored-desert-map`

## Intent

Plan spawn staging and early movement so players are not dropped under terrain, inside props, or directly into unreadable combat.

## Why This Exists

The current prototype is plateauing because broad procedural terrain and broad prop scatter cannot prove authored traversal, collider parity, or AAA readability. This atomic packet turns one part of the authored desert map into a named contract that can be implemented, validated, and restarted without re-opening the entire map problem.

## Research Anchors

- GitHub Game Engines collection shows the missing production surface should be treated as scene, asset, physics, and platform tooling gaps, not as a reason to build a general engine.
- Apex 60-player BR references support GoldRush's 60-player target and squad/objective pressure model.
- PUBG references support large-map land/loot/survive flow, training/staging, vehicles/routes, and shrinking pressure.
- Hunt references support extraction as a value-carrying, information-driven risk loop.

## Input Data

- Map revision id.
- Source plate coordinate range.
- Relevant height, mask, route, placement, collider, or prop-family layer.
- Owning packet id and validation gate.

## Output Data

- Serializable snapshot field for this atomic concern.
- Validation receipt naming source revision, affected region, and pass/fail state.
- Human-view acceptance note when the concern is visible to the player.

## Public API Shape

- `snapshot()`: reports this concern without exposing renderer internals.
- `validate()`: returns invariant failures with stable ids.
- `reset(revisionId)`: clears derived data when the map source changes.

## Internal API Shape

- Normalize source data.
- Compute derived runtime data.
- Emit proof facts.
- Hide file formats, geometry buffers, and renderer-specific details from gameplay.

## Atomic Acceptance

- One owner domain is named.
- One kit candidate is named.
- One source data dependency is named.
- One validator or proof expectation is named.
- It can be implemented without changing unrelated map concerns.

## Edge Cases

- Source revision changes after cached data exists.
- Player, prop, or camera starts outside the valid region.
- Local proof passes but public Pages proof uses stale data.
- Visible output and collider/query output diverge.
- The concern becomes too large and needs its own child packet before implementation.

## Validation Gate

Start with a CLI validator for serializable snapshot and invariants. Add Playwright human-view proof if the result affects spawn view, movement view, route readability, object readability, extraction readability, or combat readability.
