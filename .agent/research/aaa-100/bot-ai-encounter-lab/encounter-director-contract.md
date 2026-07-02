# Encounter Director Contract

Status: active

## Purpose

The encounter director owns pressure pacing. It consumes player state, bot roster, terrain regions, cargo value, threat readiness, cashout state, final-rush state, and proof mode. It emits encounter beats, not raw combat outcomes.

## Inputs

- Player position, cargo, health, and action surface.
- Bot roster and nearby density.
- Terrain region, cover descriptors, and sightlines.
- Resource and cashout state.
- Match phase and final-rush pressure.
- Proof tier and staging mode.

## Outputs

- Quiet window.
- Distant scout.
- Prospecting competition.
- Midrange threat.
- Cover fight.
- Cashout contest.
- Final-rush pressure.
- Recovery or retreat beat.

## Invariant

The director can request pressure, but combat kits must still own telegraph, cover, weapon timing, damage, and receipts.
