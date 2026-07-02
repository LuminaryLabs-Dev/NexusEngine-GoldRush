# Research - Coordinate And Scale - Proof Gate

Status: planned docs-only
Parent atom: 02-04-coordinate-scale-proof

## Research Question

What source, domain, data, proof, and edge-case knowledge is needed before implementing coordinate and scale - proof gate?

## Reference Signals

- GitHub game-engine collections reinforce that mature game projects separate rendering, physics, tooling, runtime, and content surfaces instead of hiding all behavior in one renderer.
- Apex map notes emphasize macro rotations, POI-to-POI movement tools, and predictability of navigation as battle-royale map concerns.
- PUBG Blue Zone notes emphasize movement pressure, positioning, strategic risk, survivor density, and match tempo as map/system concerns.
- Hunt extraction notes emphasize fighting over a valuable token and escaping with it, which makes route, compound, and extraction readability central.

## Domain Implication

Coordinate And Scale belongs to world. It should become source-owned data consumed by kits, not hardcoded rendering behavior.

## Data And Proof Need

The minimum data is world bounds, meters per unit, origin, authoring scale. Proof must show that this atom can survive restart, source revision changes, and local/public validation without relying on debug coordinates.

## Edge Cases

- Source revision changes but old consumer snapshots remain active.
- Public build loads a different source fixture than local proof.
- A screenshot looks correct while natural movement, collider parity, or extraction routing fails.
- Object protokits infer placement from visuals instead of source anchors.
- Future 60-player simulation uses different map partitions than single-player staging.

## Research Output

Implementation should not start until this atom has a fixture, owner kit, consumer list, validator, and stop condition accepted in the relevant matrix.
