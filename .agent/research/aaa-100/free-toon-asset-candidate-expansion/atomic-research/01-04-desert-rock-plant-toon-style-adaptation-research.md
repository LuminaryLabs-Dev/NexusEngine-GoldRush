# Desert Rock And Plant - Toon Style Adaptation Research

Status: active docs-only
Domain: world / render / physics
Target kit: n:goldrush:desert-rock-plant-protokits

## Purpose

Research the source, player-value, and implementation risks for toon style adaptation in the Desert Rock And Plant candidate set.

## Current Source Signal

Primary source direction: Kenney or Quaternius rock/cactus candidates.

## Why This Matters

This candidate set addresses: terrain reads empty, flat, and low scale. The atom matters because define how the asset will match GoldRush toon western palette, scale, silhouette, and material roles.

## Candidate Fit Questions

- Does the source prove the exact item or pack?
- Does the candidate improve player readability in GoldRush?
- Does it fit the toon western art direction after adaptation?
- Can it be owned by n:goldrush:desert-rock-plant-protokits?
- Can local and public proof show the player-facing improvement?

## Research Notes

- Kenney, Quaternius, KayKit are candidates only, not approved runtime assets.
- Source evidence must be captured at item or pack level before any candidate moves forward.
- Style adaptation must happen before runtime promotion, not after the asset is already in gameplay.
- raycast placement plus scale screenshots is the minimum proof shape for this set.

## Edge Cases

- Source page changes after candidate capture.
- Download contains extra files with different terms.
- Candidate format needs conversion and loses material or animation data.
- Asset scale works in isolation but fails beside the player, train, terrain, or POI.
- Local proof passes but public proof lacks the candidate.

## Audit Question

Would this atom still be valid if every other candidate set were removed? If not, split the dependency into a smaller packet before implementation.
