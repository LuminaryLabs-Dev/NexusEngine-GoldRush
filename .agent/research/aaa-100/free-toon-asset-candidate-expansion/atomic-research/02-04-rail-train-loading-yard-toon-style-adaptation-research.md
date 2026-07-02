# Rail Train Loading Yard - Toon Style Adaptation Research

Status: active docs-only
Domain: scene / world / transition
Target kit: n:goldrush:rail-train-protokits

## Purpose

Research the source, player-value, and implementation risks for toon style adaptation in the Rail Train Loading Yard candidate set.

## Current Source Signal

Primary source direction: Quaternius or Poly Pizza train and track candidates.

## Why This Matters

This candidate set addresses: loading-yard sequence needs a believable train and track path. The atom matters because define how the asset will match GoldRush toon western palette, scale, silhouette, and material roles.

## Candidate Fit Questions

- Does the source prove the exact item or pack?
- Does the candidate improve player readability in GoldRush?
- Does it fit the toon western art direction after adaptation?
- Can it be owned by n:goldrush:rail-train-protokits?
- Can local and public proof show the player-facing improvement?

## Research Notes

- Quaternius, Poly Pizza, KayKit are candidates only, not approved runtime assets.
- Source evidence must be captured at item or pack level before any candidate moves forward.
- Style adaptation must happen before runtime promotion, not after the asset is already in gameplay.
- boarding sequence screenshot and train motion proof is the minimum proof shape for this set.

## Edge Cases

- Source page changes after candidate capture.
- Download contains extra files with different terms.
- Candidate format needs conversion and loses material or animation data.
- Asset scale works in isolation but fails beside the player, train, terrain, or POI.
- Local proof passes but public proof lacks the candidate.

## Audit Question

Would this atom still be valid if every other candidate set were removed? If not, split the dependency into a smaller packet before implementation.
