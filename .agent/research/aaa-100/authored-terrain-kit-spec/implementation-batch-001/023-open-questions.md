# Open Questions

Status: active docs-only

Packet: 023
Domain: planning
Target kit: all authored terrain kits
Roadmap atoms: 021, 022, 023, 024, 026, 040

## Purpose

List decisions that should be answered before implementation so coding does not fill gaps with accidental engine behavior.

## Why This Prevents Plateau

Unanswered map-production decisions tend to become hidden runtime assumptions, which makes the game harder to improve later.

## Data Exposed

- questionId
- ownerDomain
- decisionNeeded
- blockedPackets
- defaultUntilResolved

## Public API Shape

- recordDecision(questionId)
- listBlockingQuestions()
- linkQuestionToPacket(packetId)

## Events And Snapshot

- terrainDecisionRecorded
- terrainQuestionBlockedPacket
- terrainQuestionResolved

Snapshot must include the target kit, source revision, consumer revision, validation state, and enough domain state to debug without leaking machine-local paths.

## Validation And Proof

- docs review confirms no blocking question is required for batch 001 coding start
- change log records resolved durable decisions

## Edge Cases And Stop Conditions

- Do not ask broad taste questions during implementation.
- Do not block coding on questions that validators can answer.
- Stop if a question changes source schema, scale, or kit ownership.

## Implementation Note

Do not code from this packet alone. Read the parent authored terrain spec, the matching atomic map packet, the matching four research packets, the implementation simulation, and the hardening audit before editing runtime files.
