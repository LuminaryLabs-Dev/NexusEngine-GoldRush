# 003 - Pressure Seed Schema Simulation

Status: planned docs-only
Parent atom: `009-cover-and-pressure-annotation-contract`
Source field: `pressureSeeds`

## Simulated Implementation

1. Add `pressureSeeds` to the tiny source fixture.
2. Add one validator assertion that fails without the field.
3. Add one query or snapshot path that echoes fixture id and revision.
4. Add one consumer expectation for renderer, ambush pressure, combat route guidance, receipts, replay, or proof.
5. Add one negative case that proves a fallback cannot pass.

## Predicted Failure Modes

- The renderer draws a threat lane first and combat logic retrofits pressure from its mesh name.
- The proof script places the player in combat with a direct setup helper instead of using source pressure queries.
- The ambush pressure kit activates without map-authored counterplay.
- A revision change updates lane visuals but not combat route guidance, receipts, replay, or public proof.
- LOD cells drop cover annotations at distance and create inconsistent threat readability.
- The source field becomes too broad and starts owning weapon, AI, or balance rules.

## Recovery Path

- Keep `pressureSeeds` as a source-data concern only.
- Add only the smallest consumer echo needed to prove ownership.
- Split new rules into a GoldRush combat or gameplay kit if they are about combat behavior rather than source annotation identity.

## Simulation Result

Future implementation is acceptable only if validator proves pressure seeds have id, trigger tags, intensity range, radius, route relation, and revision and the stop condition cannot pass through helper-only, combat-only, or renderer-only state.
