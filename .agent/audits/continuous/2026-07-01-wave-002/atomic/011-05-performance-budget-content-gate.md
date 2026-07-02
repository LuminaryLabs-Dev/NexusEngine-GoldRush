# Performance Budget Content Gate

Status: active docs-only

Atom ID: 011-05
Parent packet: 011 - Content Pipeline And Toon AAA Gap
Domain: content/art/render/legal
Owner: n:goldrush:asset-pipeline plus n:render:character-preview plus prop protokits

## Atomic Objective

Set draw, triangle, texture, audio, and memory budgets for imported/procedural assets.

## Source Context

AAA readability depends on coherent art direction, approved assets, animation, materials, performance, and provenance.

## Data Contract Seed

budget id, asset class, limit, current usage, failure action

## Event And Snapshot Seed

Event: contentBudgetSampled

Snapshot must include parent packet id, atom id, owner kit, source revision, readiness state, unresolved caveats, and sanitized proof labels.

## Validation Seed

build/proof fails if budgets are exceeded

## Research Pair

- research/011-05-performance-budget-content-gate-research.md

## Stop Condition

Stop implementation if this atom requires runtime behavior outside the named owner kit, bypasses validation, relies on unapproved assets, or lets a narrow local check imply broad AAA readiness.
