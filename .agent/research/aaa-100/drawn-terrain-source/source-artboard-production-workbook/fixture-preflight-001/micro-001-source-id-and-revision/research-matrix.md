# Micro Research Matrix

Status: active docs-only
Parent atom: `001-source-id-and-revision`

| ID | Research packet | Main risk constrained |
| --- | --- | --- |
| 001 | [Fixture Id Format research](research/001-fixture-id-format-research.md) | fixture identity becomes a loose label instead of a stable source contract |
| 002 | [Revision Id Format research](research/002-revision-id-format-research.md) | revisions cannot be compared between local and public proof |
| 003 | [Revision Reason Taxonomy research](research/003-revision-reason-taxonomy-research.md) | source changes happen without knowing which consumers became stale |
| 004 | [Source Hash Inputs research](research/004-source-hash-inputs-research.md) | revision identity is polluted by generated consumers or ignores source mutations |
| 005 | [Authoring Metadata Minimum research](research/005-authoring-metadata-minimum-research.md) | debugging needs context but reports leak irrelevant local details |
| 006 | [Consumer Echo Registry research](research/006-consumer-echo-registry-research.md) | one consumer can silently stay on old terrain math |
| 007 | [Missing Identity Negative Case research](research/007-missing-identity-negative-case-research.md) | bad source can enter runtime before the first gate |
| 008 | [Drift Negative Case research](research/008-drift-negative-case-research.md) | source drift is discovered only from visual bugs |
| 009 | [Source Summary Snapshot research](research/009-source-summary-snapshot-research.md) | debug state cannot explain which source is live |
| 010 | [Identity Event Contract research](research/010-identity-event-contract-research.md) | state changes happen without a replayable event trail |
| 011 | [Reset And Stale Proof Flags research](research/011-reset-and-stale-proof-flags-research.md) | old proof is reused after source changes |
| 012 | [Restart Packet Linkage research](research/012-restart-packet-linkage-research.md) | new terrain knowledge is lost between planning and implementation passes |
