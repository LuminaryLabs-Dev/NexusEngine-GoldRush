# Mining Cargo Tools - Proof And Promotion Block

Status: active docs-only
Domain: gameplay / content / interaction
Target kit: n:goldrush:mining-cargo-protokits

## Purpose

define local/public proof and keep runtime promotion blocked until approval records exist for Mining Cargo Tools.

## Player Problem

mine, carry, and cashout actions lack tactile object identity.

## Candidate Sources

Kenney, Quaternius, KayKit.

## Atomic Scope

This packet covers only proof and promotion block for this candidate set. It does not import, approve, promote, or place runtime assets.

## Data Contract Seed

- localProof
- publicProof
- humanReviewId
- runtimePromotion
- blockedReason

## Public API Seed

`getCandidateGateStatus(candidateId, 'proof-and-promotion-block')` should expose only safe status metadata, not local files or unapproved runtime paths.

## Internal API Seed

Private implementation may join source records, review records, conversion reports, or proof reports, but must keep unsafe paths and raw candidate details out of runtime-facing snapshots.

## Events Seed

- `mining-cargo-tools.proof-and-promotion-block.checked`
- `mining-cargo-tools.proof-and-promotion-block.blocked`
- `mining-cargo-tools.proof-and-promotion-block.readyForNextGate`

## Snapshot Seed

`{ candidateSet: 'mining-cargo-tools', gate: 'proof-and-promotion-block', state: 'planned', runtimePromotion: false }`

## Validation Gate

mine to carry to cashout human-view proof. This atom is complete only when the matching evidence exists and still keeps runtime promotion blocked.

## Expected Failure

candidate is described as runtime content before local proof, public proof, and human approval exist.

## Stop Condition

Stop if the candidate cannot move through this gate without bypassing source evidence, license evidence, style adaptation, protokit ownership, local proof, public proof, or approval policy.
