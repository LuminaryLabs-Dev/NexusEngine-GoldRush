# Fixture Preflight Matrix

Status: active docs-only
Fixture id: `goldrush.desert.artboard.fixture.001`

## Purpose

Track the minimum documents needed before the first authored terrain source fixture can become a runtime task.

| Packet | Domain | Required answer | Blocks implementation if missing |
| --- | --- | --- | --- |
| `001-fixture-intent.md` | product/world | What this tiny fixture proves and what it does not prove. | The fixture becomes another broad map rewrite. |
| `002-minimum-source-fields.md` | data/world | Exact source fields every consumer must report. | Consumers invent missing terrain facts locally. |
| `003-layer-sample-table.md` | world/physics/gameplay | The first sample grid, masks, annotations, anchors, and LOD cells. | Renderer, collider, placement, and gameplay cannot share a source. |
| `004-query-contract.md` | API/runtime | Public query names, outputs, events, snapshots, and reset behavior. | Source data cannot be safely consumed by kits. |
| `005-consumer-readiness.md` | render/physics/gameplay/content | Readiness checklist for each first consumer. | One consumer can silently remain on old procedural math. |
| `006-validator-plan.md` | validation | CLI validator cases for field presence, parity, masks, and consumers. | Green builds can miss source drift. |
| `007-human-view-proof-plan.md` | player view | Required screenshots and readability failure labels. | The source can be technically valid but visually useless. |
| `008-public-proof-and-restart.md` | deploy/versioning | Public proof and restart policy for source revision changes. | Local proof becomes stale or unrepeatable. |
| `009-implementation-simulation.md` | production | Dry-run implementation order and expected failure points. | Code resumes without knowing where it will break. |
| `010-hardening-audit.md` | audit | Fake-completion and edge-case hardening checks. | The packet gets marked ready from partial evidence. |
| `011-reference-notes.md` | research | External signals translated into GoldRush constraints. | Decisions drift into taste instead of production rules. |
| `atomic-matrix.md` | production | 24 implementation-sized fixture atoms. | The future code pass starts from a broad fixture label. |
| `research-matrix.md` | research | Paired source research for all 24 atoms. | Atom work uses taste or old assumptions. |
| `simulation-matrix.md` | production | Paired implementation dry-runs for all 24 atoms. | Known failure paths are rediscovered during coding. |
| `audit-matrix.md` | audit | Paired hardening audits for all 24 atoms. | Atoms can be marked ready from narrow proof. |

## Atomic Future Implementation Order

```txt
1. create fixture file shape
2. validate source fields
3. expose query API
4. attach one render chunk consumer
5. attach collider parity check
6. attach placement raycast check
7. attach gameplay annotation read
8. capture local human-view proof
9. capture public proof
10. record restart packet
```

## Resolution Rule

This matrix is not resolved until every packet has a named stop condition and the future code phase can start with one failing validator before visual terrain changes.
