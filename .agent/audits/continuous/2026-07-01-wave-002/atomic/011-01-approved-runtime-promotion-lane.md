# Approved Runtime Promotion Lane

Status: active docs-only

Atom ID: 011-01
Parent packet: 011 - Content Pipeline And Toon AAA Gap
Domain: content/art/render/legal
Owner: n:goldrush:asset-pipeline plus n:render:character-preview plus prop protokits

## Atomic Objective

Define how source candidates become approved runtime GLB/OGG assets.

## Source Context

AAA readability depends on coherent art direction, approved assets, animation, materials, performance, and provenance.

## Data Contract Seed

candidate id, review id, license id, approval id, runtime path

## Event And Snapshot Seed

Event: assetPromotionEvaluated

Snapshot must include parent packet id, atom id, owner kit, source revision, readiness state, unresolved caveats, and sanitized proof labels.

## Validation Seed

promotion validator shows approved records only

## Research Pair

- research/011-01-approved-runtime-promotion-lane-research.md

## Stop Condition

Stop implementation if this atom requires runtime behavior outside the named owner kit, bypasses validation, relies on unapproved assets, or lets a narrow local check imply broad AAA readiness.
