# Asset Promotion Gates

Status: active docs-only
Date: 2026-07-01
Domain: content / legal / world / render / gameplay / validation

## Purpose

Define the missing bridge between external asset candidates and approved GoldRush runtime content. This packet prevents the game from plateauing in two directions at once: endless primitives with no asset fidelity, and unsafe asset imports with no proof.

## Core Rule

Candidate assets, sanitized assets, review copies, converted files, and approval-decision drafts are not runtime assets. A runtime asset exists only after it passes source, license, provenance, hash, conversion, toon adaptation, transform, performance, protokit, placement, collider/interaction, human review, promotion, browser proof, and restart gates.

## Gate Sequence

```txt
candidate source
-> license evidence
-> provenance evidence
-> file integrity hash
-> conversion plan/output
-> toon adaptation
-> scale/pivot/origin contract
-> performance budget
-> protokit registration
-> terrain placement
-> collider/interaction role
-> human review decision
-> approved runtime promotion
-> local/public browser proof
-> rollback/restart packet
```

## Counts

- Promotion phases: 15
- Gate packet types per phase: 4
- Gate packets: 60
- Paired research notes: 60

## Files

- `promotion-gate-matrix.md`
- `promotion-research-matrix.md`
- `gate-sequence.md`
- `candidate-source-policy.md`
- `failure-mode-register.md`
- `validator-stack-plan.md`
- `runtime-promotion-contract.md`
- `gates/`
- `research/`

## Relationship To Existing Work

This packet sits between:

- `digital-asset-family-atlas/`, which names the asset families.
- `docs/asset-ingestion-policy.md`, which defines the current import and approval safety rules.
- `drawn-terrain-source/`, which defines the terrain source that should own placement masks and anchors.
- `minute-interactions/`, which defines the player-facing interactions that assets must support.

## First Implementation Direction

When implementation mode resumes, start with one asset family and one tiny fixture:

```txt
rock-boulder-talus candidate
-> source/license/provenance/hash records
-> toon adaptation proof
-> protokit descriptor
-> terrain mask placement
-> collider/cover role
-> local screenshot proof
```

Do not start by bulk-importing many assets. Prove one complete promotion route first.

