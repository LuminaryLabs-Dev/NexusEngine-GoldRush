# Character Rig Fidelity

Status: active docs-only

Atom ID: 011-03
Parent packet: 011 - Content Pipeline And Toon AAA Gap
Domain: content/art/render/legal
Owner: n:goldrush:asset-pipeline plus n:render:character-preview plus prop protokits

## Atomic Objective

Require a character with knees, locomotion, carry, mine, combat, and lobby spin states.

## Source Context

AAA readability depends on coherent art direction, approved assets, animation, materials, performance, and provenance.

## Data Contract Seed

rig id, skeleton state, animation state, equipment slots, proof pose

## Event And Snapshot Seed

Event: characterRigStateUpdated

Snapshot must include parent packet id, atom id, owner kit, source revision, readiness state, unresolved caveats, and sanitized proof labels.

## Validation Seed

animation proof shows knees and movement

## Research Pair

- research/011-03-character-rig-fidelity-research.md

## Stop Condition

Stop implementation if this atom requires runtime behavior outside the named owner kit, bypasses validation, relies on unapproved assets, or lets a narrow local check imply broad AAA readiness.
