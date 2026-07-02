# Audit 057 - Mining object contracts

Status: docs-only audit planned
Roadmap packet: .agent/research/aaa-100/057-mining-object-contracts.md
Simulation packet: .agent/simulations/aaa-100/057-mining-object-contracts.md
Domain: gameplay/content
Owning domain service: content and asset pipeline
Candidate generic kit: n:runtime:validation
Candidate GoldRush kit: n:goldrush:asset-pipeline
Audit gate: Mining is object-driven

## Intention Check

This audit exists to stop **Mining object contracts** from becoming a shallow proof or isolated feature. The step must make the long-term GoldRush target more true: high-fidelity toon-shaded wild-west extraction battle royale, 60-player-ready architecture, single-player staging, and kit-owned gameplay from title to results.

## Current-State Questions

- What live files, validators, screenshots, videos, reports, or public proof currently cover this step?
- Does that evidence cover the full requirement or only a narrow helper path?
- Which current kit owns this behavior, and does that ownership match the roadmap?
- Does this step need a neutral incubator kit, a GoldRush custom kit, or only a renderer/host consumer?
- What would regress if the next pass changes terrain, camera, interaction, network, asset promotion, or deployment?

## Findings To Test Before Implementation

- Ownership risk: content and asset pipeline can drift if implementation lands in the app host or renderer for convenience.
- Data risk: required data may be inferred from visuals instead of exposed as a reusable snapshot.
- Proof risk: the test may use direct placement, direct completion, or hidden helper APIs instead of the natural player path.
- Player-view risk: a green receipt may still feel unreadable, floaty, tiny, flat, or fake.
- Deployment risk: public Pages can lag behind local validation.
- Sanitization risk: reports, asset packets, and proof files can leak local paths or source-only locations.

## Hardening Checklist

- Confirm no runtime path references raw, sanitized, quarantine, absolute, file URL, or unapproved external asset sources.
- Confirm public API remains small and events/snapshots carry the observable state.
- Confirm reset behavior clears this feature without stale receipts.
- Confirm generated data is serializable and stable across restart.
- Confirm player-facing proof uses natural controls if the feature is interactive.
- Confirm screenshots or video are required when motion, camera, grounding, train timing, combat, or animation is involved.
- Confirm 60-player claims use simulator/snapshot scale proof, not a one-browser run.
- Confirm public deploy proof is separate from local proof.
- Confirm matrix state stays planned or active until the audit gate passes.

## Required Evidence

- Roadmap packet reviewed: .agent/research/aaa-100/057-mining-object-contracts.md
- Simulation packet reviewed: .agent/simulations/aaa-100/057-mining-object-contracts.md
- Validator or proof named before implementation.
- Change log updated after any meaningful packet or repo change.
- Matrix row updated only when evidence matches the stated gate: Mining is object-driven

## Edge Cases

- Restart after partial implementation selects an older packet and duplicates work.
- A newer kit supersedes n:goldrush:asset-pipeline, but this packet still points at the old owner.
- Local proof passes with cached or stale build output.
- Public proof points to a different branch than the branch being discussed.
- A visual proof hides the broken interaction by using a favorable camera angle.
- A simulation proof hides networking, collision, or asset approval gaps.
- User feedback reports one bug, but implementation fixes a different domain because it is easier.

## Completion State

Not complete. This audit should be closed only after the current implementation, proof coverage, deploy state, and player-view evidence all satisfy **Mining is object-driven** without weakening the original AAA goal.
