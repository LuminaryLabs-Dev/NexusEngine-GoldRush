# Micro 010 Simulation Matrix - Cashout And Extraction Annotation Contract

Status: active docs-only
Parent atom: `010-cashout-and-extraction-annotation-contract`
Fixture id: `goldrush.desert.artboard.fixture.001`

## Purpose

Predict implementation failure modes for each cashout/extraction source-data concern before future code changes.

| Step | Packet | Source Field | Status | Simulation Focus |
| --- | --- | --- | --- | --- |
| 001 | [Cashout Site Schema Simulation](simulations/001-cashout-site-schema-simulation.md) | `cashoutSites` | planned docs-only | Predict how future implementation can fail if destination data is hardcoded, renderer-owned, stale, or detached from receipts. |
| 002 | [Extraction Radius Schema Simulation](simulations/002-extraction-radius-schema-simulation.md) | `extractionRadii` | planned docs-only | Predict how future implementation can fail if destination data is hardcoded, renderer-owned, stale, or detached from receipts. |
| 003 | [Deposit Anchor Contract Simulation](simulations/003-deposit-anchor-contract-simulation.md) | `depositAnchors` | planned docs-only | Predict how future implementation can fail if destination data is hardcoded, renderer-owned, stale, or detached from receipts. |
| 004 | [Return Route Linkage Simulation](simulations/004-return-route-linkage-simulation.md) | `cashoutReturnRoutes` | planned docs-only | Predict how future implementation can fail if destination data is hardcoded, renderer-owned, stale, or detached from receipts. |
| 005 | [Cashout Risk And Contest Tags Simulation](simulations/005-cashout-risk-and-contest-tags-simulation.md) | `cashoutRiskContestTags` | planned docs-only | Predict how future implementation can fail if destination data is hardcoded, renderer-owned, stale, or detached from receipts. |
| 006 | [Cashout Readability Tags Simulation](simulations/006-cashout-readability-tags-simulation.md) | `cashoutReadabilityTags` | planned docs-only | Predict how future implementation can fail if destination data is hardcoded, renderer-owned, stale, or detached from receipts. |
| 007 | [Cashout Query Api Shape Simulation](simulations/007-cashout-query-api-shape-simulation.md) | `cashoutQueryApi` | planned docs-only | Predict how future implementation can fail if destination data is hardcoded, renderer-owned, stale, or detached from receipts. |
| 008 | [Renderer Cashout Marker Parity Simulation](simulations/008-renderer-cashout-marker-parity-simulation.md) | `rendererCashoutEcho` | planned docs-only | Predict how future implementation can fail if destination data is hardcoded, renderer-owned, stale, or detached from receipts. |
| 009 | [Extraction Hold Consumer Parity Simulation](simulations/009-extraction-hold-consumer-parity-simulation.md) | `extractionHoldEcho` | planned docs-only | Predict how future implementation can fail if destination data is hardcoded, renderer-owned, stale, or detached from receipts. |
| 010 | [Receipt And Results Consumer Parity Simulation](simulations/010-receipt-and-results-consumer-parity-simulation.md) | `cashoutReceiptResultsEcho` | planned docs-only | Predict how future implementation can fail if destination data is hardcoded, renderer-owned, stale, or detached from receipts. |
| 011 | [Cashout Negative Fixture Cases Simulation](simulations/011-cashout-negative-fixture-cases-simulation.md) | `cashoutNegativeCases` | planned docs-only | Predict how future implementation can fail if destination data is hardcoded, renderer-owned, stale, or detached from receipts. |
| 012 | [Cashout Stale Proof Simulation](simulations/012-cashout-stale-proof-simulation.md) | `cashoutRevisionPolicy` | planned docs-only | Predict how future implementation can fail if destination data is hardcoded, renderer-owned, stale, or detached from receipts. |

## Simulation Rule

A future implementation simulation fails if extraction can complete, score, replay, or pass public proof without echoing a source-owned cashout id, deposit anchor id, route id, radius band, and fixture revision where required.
