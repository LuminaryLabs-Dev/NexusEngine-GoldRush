# Mining Cargo Tools - Toon Style Adaptation

Status: active docs-only
Domain: gameplay / content / interaction
Target kit: n:goldrush:mining-cargo-protokits

## Purpose

define how the asset will match GoldRush toon western palette, scale, silhouette, and material roles for Mining Cargo Tools.

## Player Problem

mine, carry, and cashout actions lack tactile object identity.

## Candidate Sources

Kenney, Quaternius, KayKit.

## Atomic Scope

This packet covers only toon style adaptation for this candidate set. It does not import, approve, promote, or place runtime assets.

## Data Contract Seed

- paletteRole
- materialRole
- scaleBand
- silhouetteGoal
- rejectionReason

## Public API Seed

`getCandidateGateStatus(candidateId, 'toon-style-adaptation')` should expose only safe status metadata, not local files or unapproved runtime paths.

## Internal API Seed

Private implementation may join source records, review records, conversion reports, or proof reports, but must keep unsafe paths and raw candidate details out of runtime-facing snapshots.

## Events Seed

- `mining-cargo-tools.toon-style-adaptation.checked`
- `mining-cargo-tools.toon-style-adaptation.blocked`
- `mining-cargo-tools.toon-style-adaptation.readyForNextGate`

## Snapshot Seed

`{ candidateSet: 'mining-cargo-tools', gate: 'toon-style-adaptation', state: 'planned', runtimePromotion: false }`

## Validation Gate

mine to carry to cashout human-view proof. This atom is complete only when the matching evidence exists and still keeps runtime promotion blocked.

## Expected Failure

candidate looks good alone but clashes with the world, player camera, or terrain palette.

## Stop Condition

Stop if the candidate cannot move through this gate without bypassing source evidence, license evidence, style adaptation, protokit ownership, local proof, public proof, or approval policy.
