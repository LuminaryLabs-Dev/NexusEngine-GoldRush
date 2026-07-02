# Prop Protokit Fidelity

Status: active docs-only

Atom ID: 011-04
Parent packet: 011 - Content Pipeline And Toon AAA Gap
Domain: content/art/render/legal
Owner: n:goldrush:asset-pipeline plus n:render:character-preview plus prop protokits

## Atomic Objective

Upgrade rocks, plants, towers, mines, rails, towns, and gold zones through object protokits.

## Source Context

AAA readability depends on coherent art direction, approved assets, animation, materials, performance, and provenance.

## Data Contract Seed

protokit id, mesh source, placement anchor, collision role, interaction role

## Event And Snapshot Seed

Event: propFidelityEvaluated

Snapshot must include parent packet id, atom id, owner kit, source revision, readiness state, unresolved caveats, and sanitized proof labels.

## Validation Seed

validator rejects generic unowned props

## Research Pair

- research/011-04-prop-protokit-fidelity-research.md

## Stop Condition

Stop implementation if this atom requires runtime behavior outside the named owner kit, bypasses validation, relies on unapproved assets, or lets a narrow local check imply broad AAA readiness.
