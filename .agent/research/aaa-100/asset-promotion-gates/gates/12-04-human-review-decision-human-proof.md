# Human Review Decision - Human Proof

Status: planned docs-only
Phase: 12 Human Review Decision
Domain: content/review
Candidate kit: n:goldrush:human-review-gate

## Purpose

Define the player-facing, reviewer-facing, or browser-visible proof needed before the phase can be considered resolved.

## Plateau Risk

Validation scripts approve assets without human art, license, or product judgment.

## Atomic Substeps

1. Confirm the owner domain is `content/review`.
2. Confirm the target kit is `n:goldrush:human-review-gate` or create a new local GoldRush kit packet before implementation resumes.
3. Confirm this phase is not trying to promote runtime content by implication.
4. Record only the required minimal data fields.
5. Emit or define the phase event that downstream kits can subscribe to.
6. Define a serializable snapshot that can be inspected in browser proof.
7. Define a reset rule for failed or rejected phase data.
8. Add a negative case that proves unsafe promotion stays blocked.
9. Add a positive case that proves valid data can advance to the next phase.
10. Add a restart note for what to do if this phase fails repeatedly.

## Required Data

- `ownerLane`
- `decisionStatus`
- `approvalId`
- `rejectionReason`
- `reviewEvidence`

## Required Checks

- screenshot or review state
- acceptance criteria
- known fakeouts
- restart note

## Event And Snapshot Seed

- Event: `human-review-decision.human-proof.evaluated`
- Snapshot: `human-review-decision.human-proof.snapshot`
- Reset: discard unapproved phase outputs and keep only sanitized rejection evidence.

## Proof

Review decision records owner lane, decision status, approval id when approved, rejection reason when blocked, and review evidence.

## Edge Case

A human approval is not runtime promotion until the promotion planner confirms the matching license and hash records.

## Implementation Boundary

This is a docs-only gate. Runtime code, asset copying, public asset paths, and actual approval mutation are out of scope until implementation mode resumes.

