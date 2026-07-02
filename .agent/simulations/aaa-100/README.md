# AAA 100 Implementation Simulations

Status: active docs-only

## Purpose

This folder dry-runs implementation for each of the 100 GoldRush roadmap steps before runtime changes resume. Each packet simulates the likely implementation sequence, atomic work, exposed data, player-view impact, validation path, restart/versioning risk, deploy risk, and fake-progress warning.

## Use Rule

Before implementing any roadmap packet, read all three files:

1. .agent/research/aaa-100/<packet>.md
2. .agent/simulations/aaa-100/<packet>.md
3. .agent/audits/aaa-100-step-audits/<packet>.md

Do not mark a step resolved until the audit gate in the matrix passes with current evidence.

## External Reference Lens

- GitHub game engines collection: use as a missing-surface checklist for rendering, physics, tools, resources, networking, scripting, and deployment shape. Do not turn GoldRush into an engine.
- Apex Legends official page: 60-person battle royale, evolving modes, massive maps, and character identity are the comparison lens for scale and lobby expectations.
- PUBG Blue Zone revamp dev letter: zone systems should shape movement, risk, combat timing, survivor count, and match tempo without removing strategic choice.
- Hunt: Showdown official game page: extraction works because bounty, threat, sound, atmosphere, and loss pressure all reinforce one player decision: risk more or get out.

## Index

See simulation-matrix.md for all 100 rows.
