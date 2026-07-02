# Content Pipeline And Toon AAA Gap

Status: active docs-only

ID: 011
Domain: content/art/render/legal
Severity: critical
Owner: n:goldrush:asset-pipeline plus n:render:character-preview plus prop protokits
Roadmap rows informed: 036, 037, 038, 039, 040, 041, 042, 045, 046, 047, 048, 096

## Reference Observation

AAA readability depends on coherent art direction, approved assets, animation, materials, and performance budgets. GoldRush wants toon-shaded wild west, so every imported or procedural asset needs a provenance and protokit path.

## GoldRush Gap

Kenney/free candidates and legacy copied candidates are source candidates only. Runtime fidelity needs approval, GLB/material/animation conversion, character rigging, toon shader policy, and per-object kit ownership.

## Kit Implications

- asset pipeline gates raw to sanitized to approved runtime
- character preview consumes approved rigs
- prop protokits own object identity and placement
- renderer owns toon material presentation

## Evidence Required Before Calling This Resolved

- approved-runtime promotion report with nonzero approved records
- toon material validator and browser proof
- character rig proof with knees, locomotion, carry, mine, and combat states

## Edge Cases

- do not ship raw or review-only assets
- do not let procedural objects bypass protokit descriptors
- do not add high-poly assets without performance budgets

## Docs-Only Rule

This packet does not authorize runtime changes. It defines what the next implementation packet must prove before the gap can be marked resolved.
