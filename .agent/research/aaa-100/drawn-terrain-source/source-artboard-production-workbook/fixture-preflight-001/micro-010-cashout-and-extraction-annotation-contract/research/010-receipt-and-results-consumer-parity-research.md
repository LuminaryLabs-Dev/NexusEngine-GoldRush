# 010 - Receipt And Results Consumer Parity Research

Status: planned docs-only
Parent atom: `010-cashout-and-extraction-annotation-contract`
Source field: `cashoutReceiptResultsEcho`

## Purpose

Document the source signals and design implications for `cashoutReceiptResultsEcho` before future implementation.

## Current Reference Signals

- THE FINALS Cashout official page: extraction destination loops need locate, deposit, defend, and completion states that are readable to the whole match. Reference: https://www.reachthefinals.com/cash-out
- Hunt Showdown Update 2.8: extracts, supply points, and reveal rules show that destination knowledge is map state, not only UI marker state. Reference: https://www.huntshowdown.com/releasenotes/en_US/update-281781019648
- Apex Legends E-District: large combat maps need POI identity, route choice, verticality, and destination readability. Reference: https://www.ea.com/games/apex-legends/apex-legends/news/welcome-to-edistrict
- Unreal World Partition: large-world destination and activation data should be cell-aware and source-owned. Reference: https://dev.epicgames.com/documentation/en-us/unreal-engine/world-partition-in-unreal-engine
- GitHub Game Engines Collection: mature stacks separate world data, rendering, physics, gameplay, networking, and validation concerns. Reference: https://github.com/collections/game-engines

## Domain Implication

- World: the terrain source owns where extraction and cashout can happen, how players reach those destinations, and how contestable space fits the authored route web.
- Render: visuals consume cashout ids, radii, anchors, and readability tags; they do not create destination identity.
- Gameplay: hold actions, cargo transfer, contest state, scoring, receipts, and replay must keep source provenance.
- Match: results and replay must retain the cashout annotation id that accepted the gold.
- Validation: proof must fail when destination data is missing, stale, hardcoded, unowned, unreadable, or detached from receipts.

## Data Implication

- Minimal config should contain ids, revision, positions or shapes, radius bands, route links, tags, proof points, and stale-proof policy.
- Public API should expose read-only cashout and extraction queries plus serializable consumer snapshots.
- Internal API may derive radius bands, route hints, visibility classes, contest state, receipt joins, and proof samples behind the kit boundary.

## Edge Cases

- Duplicate cashout ids or deposit anchors across LOD cells.
- Cashout marker visible but deposit anchor unreachable.
- Extraction radius works in gameplay but does not match the rendered ring.
- Receipt or score records extracted gold without cashout source provenance.
- Public proof reuses a stale screenshot after cashout source revision changes.
- Bot staging or simulator reaches cashout through a helper route that the source map did not authorize.

## Implementation Question

What exact consumer echo proves `cashoutReceiptResultsEcho` is source-owned and not inferred from a marker, primitive, helper, or scoring shortcut?
