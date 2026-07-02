# 004 - Slope Class Taxonomy Audit

Status: planned docs-only
Parent atom: `004-normal-and-slope-contract`

## Finding

The normal and slope pass can fake completion if `slopeClass` exists but consumers do not use it.

## Why It Matters

gameplay logic invents walkability labels outside the terrain source contract.

## Long-Term Impact

- Player movement can feel inconsistent because walkable, slow, slide, and blocked states are not source-owned.
- Prop placement and interaction prompts can look grounded while gameplay uses different slope truth.
- Combat cover and route readability can break when mountain paths, ridge walls, and extraction shelves disagree about slope.

## Hardening

- Require source fixture or query schema proof.
- Require negative validator proof.
- Require at least one movement or placement consumer echo.
- Require stale-proof behavior after source normal or slope changes.
- Require human-view or state proof that can compare source normal, slope class, player grounding, and object placement when this becomes runtime work.

## Audit Rewrite

Do not mark this micro-step resolved until sampleGround returns flat, walkable, steep, blocker, or edge class from source thresholds and the validator catches the opposite failure.
