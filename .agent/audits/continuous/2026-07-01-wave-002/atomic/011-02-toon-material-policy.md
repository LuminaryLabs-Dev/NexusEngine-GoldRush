# Toon Material Policy

Status: active docs-only

Atom ID: 011-02
Parent packet: 011 - Content Pipeline And Toon AAA Gap
Domain: content/art/render/legal
Owner: n:goldrush:asset-pipeline plus n:render:character-preview plus prop protokits

## Atomic Objective

Define toon material roles for desert, rock, plant, wood, metal, gold, cloth, character, and sky.

## Source Context

AAA readability depends on coherent art direction, approved assets, animation, materials, performance, and provenance.

## Data Contract Seed

material role, palette key, ramp, outline policy, LOD use

## Event And Snapshot Seed

Event: toonMaterialPolicyLoaded

Snapshot must include parent packet id, atom id, owner kit, source revision, readiness state, unresolved caveats, and sanitized proof labels.

## Validation Seed

browser proof checks role separation

## Research Pair

- research/011-02-toon-material-policy-research.md

## Stop Condition

Stop implementation if this atom requires runtime behavior outside the named owner kit, bypasses validation, relies on unapproved assets, or lets a narrow local check imply broad AAA readiness.
