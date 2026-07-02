# Micro 010 Audit Matrix - Cashout And Extraction Annotation Contract

Status: active docs-only
Parent atom: `010-cashout-and-extraction-annotation-contract`
Fixture id: `goldrush.desert.artboard.fixture.001`

## Purpose

Define hardening checks for each future cashout/extraction implementation slice.

| Step | Packet | Source Field | Status | Audit Focus |
| --- | --- | --- | --- | --- |
| 001 | [Cashout Site Schema Audit](audits/001-cashout-site-schema-audit.md) | `cashoutSites` | planned docs-only | Require source ownership, consumer echo, negative fixture, player-view readability, and stale-proof gates. |
| 002 | [Extraction Radius Schema Audit](audits/002-extraction-radius-schema-audit.md) | `extractionRadii` | planned docs-only | Require source ownership, consumer echo, negative fixture, player-view readability, and stale-proof gates. |
| 003 | [Deposit Anchor Contract Audit](audits/003-deposit-anchor-contract-audit.md) | `depositAnchors` | planned docs-only | Require source ownership, consumer echo, negative fixture, player-view readability, and stale-proof gates. |
| 004 | [Return Route Linkage Audit](audits/004-return-route-linkage-audit.md) | `cashoutReturnRoutes` | planned docs-only | Require source ownership, consumer echo, negative fixture, player-view readability, and stale-proof gates. |
| 005 | [Cashout Risk And Contest Tags Audit](audits/005-cashout-risk-and-contest-tags-audit.md) | `cashoutRiskContestTags` | planned docs-only | Require source ownership, consumer echo, negative fixture, player-view readability, and stale-proof gates. |
| 006 | [Cashout Readability Tags Audit](audits/006-cashout-readability-tags-audit.md) | `cashoutReadabilityTags` | planned docs-only | Require source ownership, consumer echo, negative fixture, player-view readability, and stale-proof gates. |
| 007 | [Cashout Query Api Shape Audit](audits/007-cashout-query-api-shape-audit.md) | `cashoutQueryApi` | planned docs-only | Require source ownership, consumer echo, negative fixture, player-view readability, and stale-proof gates. |
| 008 | [Renderer Cashout Marker Parity Audit](audits/008-renderer-cashout-marker-parity-audit.md) | `rendererCashoutEcho` | planned docs-only | Require source ownership, consumer echo, negative fixture, player-view readability, and stale-proof gates. |
| 009 | [Extraction Hold Consumer Parity Audit](audits/009-extraction-hold-consumer-parity-audit.md) | `extractionHoldEcho` | planned docs-only | Require source ownership, consumer echo, negative fixture, player-view readability, and stale-proof gates. |
| 010 | [Receipt And Results Consumer Parity Audit](audits/010-receipt-and-results-consumer-parity-audit.md) | `cashoutReceiptResultsEcho` | planned docs-only | Require source ownership, consumer echo, negative fixture, player-view readability, and stale-proof gates. |
| 011 | [Cashout Negative Fixture Cases Audit](audits/011-cashout-negative-fixture-cases-audit.md) | `cashoutNegativeCases` | planned docs-only | Require source ownership, consumer echo, negative fixture, player-view readability, and stale-proof gates. |
| 012 | [Cashout Stale Proof Audit](audits/012-cashout-stale-proof-audit.md) | `cashoutRevisionPolicy` | planned docs-only | Require source ownership, consumer echo, negative fixture, player-view readability, and stale-proof gates. |

## Audit Rule

A future implementation does not pass if it proves only that a marker exists. It must prove player-readable destination identity, source-owned extraction geometry, consumer parity, receipt provenance, negative cases, and stale-proof refresh.
