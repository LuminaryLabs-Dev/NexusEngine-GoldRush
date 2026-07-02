# Artboard Matrix

Status: active docs-only

## Purpose

Track the source-artboard pages needed before terrain implementation resumes.

| Sheet | Domain | Required output | Blocks implementation if missing |
| --- | --- | --- | --- |
| `001-artboard-intent.md` | world/product | One-sentence map promise and source authority rule. | Terrain remains a bigger procedural test field. |
| `002-layer-stack.md` | world/data | Required layer list and ownership. | Renderer, collider, and gameplay invent separate maps. |
| `003-coordinate-and-scale-sheet.md` | world/network | World bounds, units, cells, player scale, and 60-player density assumptions. | Map cannot be tested for squad or partition scale. |
| `004-macro-composition-sheet.md` | art/world | Basin, mountain, mesas, town, rail, mine, cashout, and horizon composition. | Player cannot read the place from camera height. |
| `005-height-mask-authoring-sheet.md` | world/physics | Height, slope, normal, walkable, blocker, material, and biome masks. | Terrain collider and grounding cannot be trusted. |
| `006-lod-extraction-sheet.md` | render/performance | Near, mid, far, and horizon extraction policy. | Big map will either pop, seam, or overdraw. |
| `007-asset-stamp-palette.md` | content/art | Terrain-grounded object family stamps and placement constraints. | Assets remain ad hoc decoration. |
| `008-gameplay-annotation-sheet.md` | gameplay/world | Route, risk, gold, cover, extraction, pressure, train, and bot annotations. | Mechanics work but map has no game design. |
| `009-proof-shot-list.md` | validation | Human-view screenshot states and failure labels. | Technical proof can pass while the map still reads poorly. |
| `010-implementation-readiness-gate.md` | production | Minimum fixture gate before code starts. | Implementation becomes another broad terrain rewrite. |
| `011-reference-notes.md` | research | Current source signals and GoldRush translation. | Research decisions drift into vague taste. |
| `audit-checklist.md` | audit | Fake-completion checks for source, LOD, collider, assets, gameplay, and public proof. | Rows get marked resolved from partial evidence. |
| `fixture-preflight-001/` | production/data | Tiny source fixture preflight for `goldrush.desert.artboard.fixture.001`. | Terrain code resumes without a source revision, consumer parity, or proof gate. |

## Atomic Expansion

| Matrix | Purpose |
| --- | --- |
| `atomic-matrix.md` | 48 implementation-sized artboard atoms. |
| `research-matrix.md` | Paired source/reference research for each atom. |
| `simulation-matrix.md` | Dry-run implementation failure prediction for each atom. |
| `audit-matrix.md` | Fake-completion hardening audit for each atom. |

## Fixture Preflight

| Packet | Purpose |
| --- | --- |
| `fixture-preflight-001/fixture-preflight-matrix.md` | Source fixture field, query, consumer, validation, proof, public deploy, restart, simulation, and audit gate. |
| `fixture-preflight-001/atomic-matrix.md` | 24 source-fixture implementation atoms. |
| `fixture-preflight-001/research-matrix.md` | 24 paired source/domain research notes for the fixture atoms. |
| `fixture-preflight-001/simulation-matrix.md` | 24 dry-run implementation simulations for the fixture atoms. |
| `fixture-preflight-001/audit-matrix.md` | 24 hardening audits for source drift, consumer drift, narrow proof, and restart failures. |
