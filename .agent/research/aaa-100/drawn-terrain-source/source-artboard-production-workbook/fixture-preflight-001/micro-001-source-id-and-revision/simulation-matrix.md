# Micro Simulation Matrix

Status: active docs-only
Parent atom: `001-source-id-and-revision`

| ID | Simulation packet | Simulated target |
| --- | --- | --- |
| 001 | [Fixture Id Format simulation](simulations/001-fixture-id-format-simulation.md) | validator rejects ids outside goldrush.desert.artboard.fixture.* |
| 002 | [Revision Id Format simulation](simulations/002-revision-id-format-simulation.md) | validator rejects empty, random, or non-repeatable revision ids |
| 003 | [Revision Reason Taxonomy simulation](simulations/003-revision-reason-taxonomy-simulation.md) | every revision explains whether source, mask, annotation, LOD, or proof changed |
| 004 | [Source Hash Inputs simulation](simulations/004-source-hash-inputs-simulation.md) | hash ignores derived render or physics output and changes when source fields change |
| 005 | [Authoring Metadata Minimum simulation](simulations/005-authoring-metadata-minimum-simulation.md) | metadata is useful for restart but safe for public reports |
| 006 | [Consumer Echo Registry simulation](simulations/006-consumer-echo-registry-simulation.md) | render, collider, movement, placement, gameplay, proof list fixtureId and revisionId |
| 007 | [Missing Identity Negative Case simulation](simulations/007-missing-identity-negative-case-simulation.md) | validator fails missing fixtureId or missing revisionId before any consumer runs |
| 008 | [Drift Negative Case simulation](simulations/008-drift-negative-case-simulation.md) | validator fails when any consumer echoes a mismatched id or revision |
| 009 | [Source Summary Snapshot simulation](simulations/009-source-summary-snapshot-simulation.md) | snapshot contains fixtureId, revisionId, reason, sourceHash, consumers, drift, and validation state |
| 010 | [Identity Event Contract simulation](simulations/010-identity-event-contract-simulation.md) | events carry fixtureId, revisionId, and consumer id when relevant |
| 011 | [Reset And Stale Proof Flags simulation](simulations/011-reset-and-stale-proof-flags-simulation.md) | revision changes mark render, collider, placement, gameplay, local proof, and public proof stale |
| 012 | [Restart Packet Linkage simulation](simulations/012-restart-packet-linkage-simulation.md) | source revision changes require restart packet fields before row status changes |
