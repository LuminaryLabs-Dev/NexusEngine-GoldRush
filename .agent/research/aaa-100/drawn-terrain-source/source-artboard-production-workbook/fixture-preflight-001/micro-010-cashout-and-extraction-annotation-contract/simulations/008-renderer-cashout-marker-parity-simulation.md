# 008 - Renderer Cashout Marker Parity Simulation

Status: planned docs-only
Parent atom: `010-cashout-and-extraction-annotation-contract`
Source field: `rendererCashoutEcho`

## Simulated Implementation

1. Add `rendererCashoutEcho` to the tiny source fixture.
2. Add one validator assertion that fails without the field.
3. Add one query or snapshot path that echoes fixture id and revision.
4. Add one consumer expectation for renderer, extraction hold, route guidance, receipt, scoring, replay, bot staging, simulator proof, or public proof.
5. Add one negative case that proves a fallback cannot pass.

## Predicted Failure Modes

- The renderer draws a cashout marker first and gameplay retrofits destination identity from its mesh name.
- The proof script teleports the player to extraction with a direct setup helper instead of using source cashout queries.
- Extraction completes without a deposit anchor, route link, contest radius, or fixture revision.
- A revision change updates marker visuals but not hold actions, receipts, scoring, replay, or public proof.
- LOD cells drop cashout annotations at distance and create inconsistent destination readability.
- The source field becomes too broad and starts owning economy, weapon, AI, or balance rules.

## Recovery Path

- Keep `rendererCashoutEcho` as a source-data concern only.
- Add only the smallest consumer echo needed to prove ownership.
- Split new rules into a GoldRush gameplay, match, or presentation kit if they are about extraction behavior rather than source annotation identity.

## Simulation Result

Future implementation is acceptable only if renderer snapshots echo source cashout id, anchor id, state/readability role, radius band, and fixture revision. and the stop condition cannot pass through helper-only, gameplay-only, renderer-only, scoring-only, or stale-proof state.
