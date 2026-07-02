# Sky Atmosphere Material - Format Integrity Research

Status: active docs-only
Domain: render / world / art
Target kit: n:goldrush:toon-atmosphere-protokits

## Purpose

Research the source, player-value, and implementation risks for format integrity in the Sky Atmosphere Material candidate set.

## Current Source Signal

Primary source direction: in-repo authored palette plus CC0 reference candidates.

## Why This Matters

This candidate set addresses: terrain and horizon need a coherent toon mood. The atom matters because confirm the candidate format can enter a browser Three.js pipeline without unsafe conversion surprises.

## Candidate Fit Questions

- Does the source prove the exact item or pack?
- Does the candidate improve player readability in GoldRush?
- Does it fit the toon western art direction after adaptation?
- Can it be owned by n:goldrush:toon-atmosphere-protokits?
- Can local and public proof show the player-facing improvement?

## Research Notes

- Poly Haven, Kenney, authored material work are candidates only, not approved runtime assets.
- Source evidence must be captured at item or pack level before any candidate moves forward.
- Style adaptation must happen before runtime promotion, not after the asset is already in gameplay.
- first-viewport horizon and mobile proof is the minimum proof shape for this set.

## Edge Cases

- Source page changes after candidate capture.
- Download contains extra files with different terms.
- Candidate format needs conversion and loses material or animation data.
- Asset scale works in isolation but fails beside the player, train, terrain, or POI.
- Local proof passes but public proof lacks the candidate.

## Audit Question

Would this atom still be valid if every other candidate set were removed? If not, split the dependency into a smaller packet before implementation.
