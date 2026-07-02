# Micro 010 Matrix - Cashout And Extraction Annotation Contract

Status: active docs-only
Parent atom: `010-cashout-and-extraction-annotation-contract`
Fixture id: `goldrush.desert.artboard.fixture.001`

## Purpose

Track the 12 micro-steps that must be designed before future cashout and extraction annotation code starts.

| Step | Packet | Source Field | Status | Required Proof | Stop Condition |
| --- | --- | --- | --- | --- | --- |
| 001 | [Cashout Site Schema](micro/001-cashout-site-schema.md) | `cashoutSites` | planned docs-only | validator proves source-owned cashout sites have id, shape, radius, role, approach lanes, state tags, and revision. | Stop if a cashout marker can be derived only from a renderer beacon or hardcoded coordinate. |
| 002 | [Extraction Radius Schema](micro/002-extraction-radius-schema.md) | `extractionRadii` | planned docs-only | validator proves every extraction/cashout site has radius, hold radius, contest radius, safe edge, and revision. | Stop if extraction range is only hardcoded in the gameplay loop. |
| 003 | [Deposit Anchor Contract](micro/003-deposit-anchor-contract.md) | `depositAnchors` | planned docs-only | validator proves deposit/cashout interaction anchors have id, position, facing, stance, input range, and revision. | Stop if a cashout hold can start without a source deposit anchor id. |
| 004 | [Return Route Linkage](micro/004-return-route-linkage.md) | `cashoutReturnRoutes` | planned docs-only | validator proves cashout sites link back to route ids, return lanes, mine routes, retreat lanes, and fixture revision. | Stop if the route back to cashout is only a player guidance target calculation. |
| 005 | [Cashout Risk And Contest Tags](micro/005-cashout-risk-and-contest-tags.md) | `cashoutRiskContestTags` | planned docs-only | validator proves cashout sites expose risk tier, contest class, visibility class, pressure relation, and extraction value tags as closed values. | Stop if cashout contest or lockdown state is only derived from current combat pressure. |
| 006 | [Cashout Readability Tags](micro/006-cashout-readability-tags.md) | `cashoutReadabilityTags` | planned docs-only | validator proves each cashout site carries silhouette, beacon, audio cue, approach visibility, prompt clarity, and occlusion tags. | Stop if cashout exists in state but cannot be visually or aurally distinguished in player view. |
| 007 | [Cashout Query Api Shape](micro/007-cashout-query-api-shape.md) | `cashoutQueryApi` | planned docs-only | getCashoutAt reports site id, radius band, anchor id, route link, risk tags, and revision at named proof points. | Stop if gameplay or renderer queries cashout through local marker objects. |
| 008 | [Renderer Cashout Marker Parity](micro/008-renderer-cashout-marker-parity.md) | `rendererCashoutEcho` | planned docs-only | renderer snapshots echo source cashout id, anchor id, state/readability role, radius band, and fixture revision. | Stop if marker visuals can exist without source cashout annotation ids. |
| 009 | [Extraction Hold Consumer Parity](micro/009-extraction-hold-consumer-parity.md) | `extractionHoldEcho` | planned docs-only | extraction hold snapshots echo source cashout id, anchor id, hold progress, contest state, cancel reason, and revision. | Stop if hold action can complete against an unannotated cashout site. |
| 010 | [Receipt And Results Consumer Parity](micro/010-receipt-and-results-consumer-parity.md) | `cashoutReceiptResultsEcho` | planned docs-only | extraction receipts, scoring, replay, and results name the same source cashout annotation that accepted the carried gold. | Stop if a result score can be produced from extracted gold without source cashout provenance. |
| 011 | [Cashout Negative Fixture Cases](micro/011-cashout-negative-fixture-cases.md) | `cashoutNegativeCases` | planned docs-only | validator fails missing site ids, duplicate anchors, invalid radii, orphan return routes, unknown tags, unreachable sites, and stale consumer echoes. | Stop if validation only proves one marker exists. |
| 012 | [Cashout Stale Proof](micro/012-cashout-stale-proof.md) | `cashoutRevisionPolicy` | planned docs-only | source revision changes mark renderer markers, extraction holds, receipts, scoring, screenshots, simulator proof, and public proof stale. | Stop if source cashout changes do not force extraction proof refresh. |

## Implementation Boundary

Do not implement runtime cashout extraction behavior from this matrix yet. Future code should pick one row, add the smallest source fixture and validator proof for that row, and stop if any renderer, gameplay, receipt, or proof consumer can bypass source annotation identity.
