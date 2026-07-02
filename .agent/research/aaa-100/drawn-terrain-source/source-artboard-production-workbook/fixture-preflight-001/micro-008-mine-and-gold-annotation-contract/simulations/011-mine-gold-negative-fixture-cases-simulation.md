# 011 - Mine Gold Negative Fixture Cases Simulation

Status: planned docs-only
Parent atom: `008-mine-and-gold-annotation-contract`
Source field: `mineGoldNegativeCases`

## Simulated Implementation

1. Add `mineGoldNegativeCases` to the tiny source fixture.
2. Add one validator assertion that fails without the field.
3. Add one query or snapshot path that echoes fixture id and revision.
4. Add one consumer expectation for renderer, interaction, cargo, scoring, or proof.
5. Add one negative case that proves a fallback cannot pass.

## Predicted Failure Modes

- The renderer draws the object first and gameplay retrofits mineability from its mesh name.
- The proof script positions the player at a helper coordinate instead of using a source annotation query.
- The scoring kit accepts gold without source provenance.
- A revision change updates visuals but not cargo, replay, or public proof.
- LOD cells drop the annotation at distance and create inconsistent player guidance.
- The source field becomes too broad and starts owning unrelated economy rules.

## Recovery Path

- Keep `mineGoldNegativeCases` as a source-data concern only.
- Add only the smallest consumer echo needed to prove ownership.
- Split new rules into a GoldRush gameplay kit if they are about mining behavior rather than source annotation identity.

## Simulation Result

Future implementation is acceptable only if validator fails missing mine ids, duplicate seam ids, unknown tier tags, orphan resource nodes, blocked workspaces, and stale consumer echoes and the stop condition cannot pass through helper-only or renderer-only state.
