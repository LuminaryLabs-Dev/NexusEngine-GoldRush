# Micro Matrix

Status: implemented-local
Parent atom: `001-source-id-and-revision`
Fixture id: `goldrush.desert.artboard.fixture.001`

| ID | Micro atom | Domain | Data contract | Required proof | State |
| --- | --- | --- | --- | --- | --- |
| 001 | [Fixture Id Format](micro/001-fixture-id-format.md) | runtime/source | fixtureId exact string and namespace pattern | validator rejects ids outside goldrush.desert.artboard.fixture.* | implemented-local |
| 002 | [Revision Id Format](micro/002-revision-id-format.md) | runtime/versioning | revisionId deterministic short id | validator rejects empty, random, or non-repeatable revision ids | implemented-local |
| 003 | [Revision Reason Taxonomy](micro/003-revision-reason-taxonomy.md) | production/versioning | revisionReason enum and short note | every revision explains whether source, mask, annotation, LOD, or proof changed | implemented-local |
| 004 | [Source Hash Inputs](micro/004-source-hash-inputs.md) | runtime/source | stable hash inputs from source fields only | hash ignores derived render or physics output and changes when source fields change | implemented-local |
| 005 | [Authoring Metadata Minimum](micro/005-authoring-metadata-minimum.md) | world/production | authoring note, source family, intended slice, no private path fields | metadata is useful for restart but safe for public reports | implemented-local |
| 006 | [Consumer Echo Registry](micro/006-consumer-echo-registry.md) | runtime/snapshot | expected consumer ids and echo fields | render, collider, movement, placement, gameplay, proof list fixtureId and revisionId | implemented-local |
| 007 | [Missing Identity Negative Case](micro/007-missing-identity-negative-case.md) | validation | fixture missing id or revision failure cases | validator fails missing fixtureId or missing revisionId before any consumer runs | implemented-local |
| 008 | [Drift Negative Case](micro/008-drift-negative-case.md) | validation | consumer fixture or revision mismatch failure cases | validator fails when any consumer echoes a mismatched id or revision | implemented-local |
| 009 | [Source Summary Snapshot](micro/009-source-summary-snapshot.md) | runtime/snapshot | summary shape for fixture state | snapshot contains fixtureId, revisionId, reason, sourceHash, consumers, drift, and validation state | implemented-local |
| 010 | [Identity Event Contract](micro/010-identity-event-contract.md) | runtime/events | loaded, rejected, changed, consumerReady, consumerDrift events | events carry fixtureId, revisionId, and consumer id when relevant | implemented-local |
| 011 | [Reset And Stale Proof Flags](micro/011-reset-and-stale-proof-flags.md) | runtime/proof | reset behavior and stale proof flags | revision changes mark render, collider, placement, gameplay, local proof, and public proof stale | implemented-local |
| 012 | [Restart Packet Linkage](micro/012-restart-packet-linkage.md) | production/restart | restart packet fields and lesson-update trigger | source revision changes require restart packet fields before row status changes | implemented-local |

## Use Rule

Choose one micro atom and read its matching research, simulation, and audit before implementation.

## Local Proof

`node tools/validation/validate-authored-terrain-fixture.mjs` proves all 12 rows for the source identity fixture only. It does not prove authored terrain geometry, heightfield parity, masks, LOD chunks, gameplay zones, or public browser proof.
