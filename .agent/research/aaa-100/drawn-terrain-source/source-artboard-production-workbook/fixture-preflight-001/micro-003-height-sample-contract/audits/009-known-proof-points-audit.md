# 009 - Known Proof Points Audit

Status: planned docs-only
Parent atom: `003-height-sample-contract`

## Finding

The height sample pass can fake completion if `heightProofPoints` exists but consumers do not use it.

## Why It Matters

height proof passes on arbitrary points while gameplay-critical locations remain unproven.

## Long-Term Impact

- Terrain fidelity work becomes hard to debug because screenshots, colliders, raycasts, and route markers describe different heights.
- Player movement and camera proof can pass locally while future map revisions create floating or sinking behavior.
- Prop placement, mining affordances, cashout zones, and cover can appear grounded while gameplay receipts use different vertical facts.

## Hardening

- Require source fixture schema proof.
- Require negative validator proof.
- Require at least one consumer echo.
- Require stale-proof behavior after source height changes.
- Require human-view or state proof that can compare source height, rendered height, collider height, and player grounding when this becomes runtime work.

## Audit Rewrite

Do not mark this micro-step resolved until validator checks named spawn, route, mine, cashout, and blocker sample points and the validator catches the opposite failure.
