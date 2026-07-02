# Implementation Stop Conditions

Status: active docs-only

Packet: 024
Domain: planning
Target kit: all authored terrain kits
Roadmap atoms: 021, 022, 023, 024, 026, 040

## Purpose

Define when the next coding pass must stop and return to docs, proof, or product direction instead of pushing through uncertainty.

## Why This Prevents Plateau

The fastest way to keep plateauing is to ship more terrain code after the source-of-truth contract has already split.

## Data Exposed

- stopConditionId
- domain
- trigger
- requiredEvidence
- restartPacket

## Public API Shape

- raiseStopCondition(conditionId)
- linkStopToProof(conditionId)
- clearStopCondition(conditionId)

## Events And Snapshot

- implementationStopRaised
- implementationStopCleared
- implementationRestarted

Snapshot must include the target kit, source revision, consumer revision, validation state, and enough domain state to debug without leaking machine-local paths.

## Validation And Proof

- batch README names stop conditions before implementation starts
- future change log references any stop condition hit

## Edge Cases And Stop Conditions

- Stop if visible terrain and collider sample mismatch beyond tolerance.
- Stop if public proof cannot reproduce local terrain revision.
- Stop if runtime implementation requires copying external repos or unapproved assets.

## Implementation Note

Do not code from this packet alone. Read the parent authored terrain spec, the matching atomic map packet, the matching four research packets, the implementation simulation, and the hardening audit before editing runtime files.
