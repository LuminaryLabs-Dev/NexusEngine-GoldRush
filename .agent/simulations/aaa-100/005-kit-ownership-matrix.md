# Simulation 005 - Kit ownership matrix

Status: docs-only dry-run
Roadmap packet: .agent/research/aaa-100/005-kit-ownership-matrix.md
Domain: architecture
Current matrix state: planned
Owning domain service: domain service architecture
Candidate generic kit: n:runtime:domain-registry
Candidate GoldRush kit: n:goldrush:runtime
Audit gate: No feature lacks an owning domain

## Intent

Simulate what implementation of **Kit ownership matrix** would be like before runtime work starts. This packet is not permission to code; it is a pre-implementation rehearsal that should expose where the step could fake progress, break deploys, or contradict the AAA GoldRush target.

## Reference Lens

- GitHub game engines collection: use as a missing-surface checklist for rendering, physics, tools, resources, networking, scripting, and deployment shape. Do not turn GoldRush into an engine.
- Apex Legends official page: 60-person battle royale, evolving modes, massive maps, and character identity are the comparison lens for scale and lobby expectations.
- PUBG Blue Zone revamp dev letter: zone systems should shape movement, risk, combat timing, survivor count, and match tempo without removing strategic choice.
- Hunt: Showdown official game page: extraction works because bounty, threat, sound, atmosphere, and loss pressure all reinforce one player decision: risk more or get out.

## Implementation Sequence Simulation

1. Re-read the roadmap packet and the latest repo evidence before editing.
2. Confirm the owning domain service is still **domain service architecture** and that no newer packet replaced this step.
3. Identify the smallest public API surface needed for Kit ownership matrix; keep tuning/config minimal.
4. Decide whether the work belongs in a neutral incubator kit, a GoldRush custom kit, or a renderer/host adapter that only consumes kit state.
5. Draft the event and snapshot shape before changing runtime behavior.
6. Implement behind a stable local kit boundary only when docs-only mode is lifted.
7. Run the closest CLI validator, then add Playwright or video proof if a player would see or feel the result.
8. Update the data matrix, lessons matrix, goal packet, and change log only after proof describes exactly what it covers.

## Atomic Work Breakdown

- Confirm intention: write the one player or production problem this step solves.
- Confirm owner: bind the problem to domain service architecture, not a loose renderer/app helper.
- Confirm input data: list the required data sources and reject any unapproved raw/sanitized asset dependency.
- Confirm public API: expose commands and queries only when another kit must call them.
- Confirm internal API: keep heavy logic behind private helpers and stable snapshots.
- Confirm events: emit facts that can drive replay, proof, and downstream kits.
- Confirm reset: define how a restart clears state without stale receipts.
- Confirm validation: choose one fast validator and one human-view proof if player-facing.
- Confirm deploy safety: ensure public Build can run without local-only paths or helper state.
- Confirm restart note: update the correct matrix so a future agent can resume without chat memory.

## Data To Expose

- domainPath
- publicApi
- internalApi
- events
- snapshot
- reset

## Likely Bottleneck

The main risk is creating contracts after implementation instead of letting the contracts shape implementation.

## Player-View Simulation

The player benefits when systems stop fighting each other and every action has one owner.

For this specific step, the player-facing question is: does **Kit ownership matrix** make the title -> lobby -> train -> gold field -> mine -> carry -> pressure -> extract -> results loop more understandable, tactile, scalable, or reliable?

## Validator And Proof Plan

- Minimum CLI proof: add or reuse the closest validator that can assert the architecture contract without browser state.
- Human-view proof: required if Kit ownership matrix affects camera, motion, terrain, interaction, combat, UI, audio, or visible content.
- Simulator proof: required if Kit ownership matrix claims 20, 50, 60, or 100 player scale.
- Public proof: required before any deploy or Pages claim.
- Sanitized proof: required for any report, asset, audio, path, or external-source packet.

## Restart And Versioning Risks

- A future pass may start from this packet after the runtime changed; the first action must be current-state verification.
- If implementation finds a better owner than n:goldrush:runtime, update this packet instead of layering duplicate kits.
- Any rollback must preserve the roadmap row and record why the previous approach failed.
- If proof coverage narrows, the matrix state must not be upgraded.

## Deployment Edge Cases

- Public build may not include local proof-only assets.
- Build branch may lag behind default branch.
- Browser-only behavior may pass locally and fail in Pages because of asset base paths or timing.
- Generated reports can leak local or account data if sanitizer gates are skipped.
- A helper scenario can pass while the natural player path is still broken.

## Fake Progress Warning

Do not mark this step resolved because a state object exists. Mark it resolved only when the audit gate passes: **No feature lacks an owning domain**.
