# Micro Audit Matrix

Status: active docs-only
Parent atom: `001-source-id-and-revision`

| ID | Audit packet | Fake-completion risk |
| --- | --- | --- |
| 001 | [Fixture Id Format audit](audits/001-fixture-id-format-audit.md) | fixture identity becomes a loose label instead of a stable source contract |
| 002 | [Revision Id Format audit](audits/002-revision-id-format-audit.md) | revisions cannot be compared between local and public proof |
| 003 | [Revision Reason Taxonomy audit](audits/003-revision-reason-taxonomy-audit.md) | source changes happen without knowing which consumers became stale |
| 004 | [Source Hash Inputs audit](audits/004-source-hash-inputs-audit.md) | revision identity is polluted by generated consumers or ignores source mutations |
| 005 | [Authoring Metadata Minimum audit](audits/005-authoring-metadata-minimum-audit.md) | debugging needs context but reports leak irrelevant local details |
| 006 | [Consumer Echo Registry audit](audits/006-consumer-echo-registry-audit.md) | one consumer can silently stay on old terrain math |
| 007 | [Missing Identity Negative Case audit](audits/007-missing-identity-negative-case-audit.md) | bad source can enter runtime before the first gate |
| 008 | [Drift Negative Case audit](audits/008-drift-negative-case-audit.md) | source drift is discovered only from visual bugs |
| 009 | [Source Summary Snapshot audit](audits/009-source-summary-snapshot-audit.md) | debug state cannot explain which source is live |
| 010 | [Identity Event Contract audit](audits/010-identity-event-contract-audit.md) | state changes happen without a replayable event trail |
| 011 | [Reset And Stale Proof Flags audit](audits/011-reset-and-stale-proof-flags-audit.md) | old proof is reused after source changes |
| 012 | [Restart Packet Linkage audit](audits/012-restart-packet-linkage-audit.md) | new terrain knowledge is lost between planning and implementation passes |
