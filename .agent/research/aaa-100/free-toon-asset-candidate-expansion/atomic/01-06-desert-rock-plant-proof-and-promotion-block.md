# Desert Rock And Plant - Proof And Promotion Block

Status: active docs-only
Domain: world / render / physics
Target kit: n:goldrush:desert-rock-plant-protokits

## Purpose

define local/public proof and keep runtime promotion blocked until approval records exist for Desert Rock And Plant.

## Player Problem

terrain reads empty, flat, and low scale.

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

- `desert-rock-plant.proof-and-promotion-block.checked`
- `desert-rock-plant.proof-and-promotion-block.blocked`
- `desert-rock-plant.proof-and-promotion-block.readyForNextGate`

## Snapshot Seed

`{ candidateSet: 'desert-rock-plant', gate: 'proof-and-promotion-block', state: 'planned', runtimePromotion: false }`

## Validation Gate

raycast placement plus scale screenshots. This atom is complete only when the matching evidence exists and still keeps runtime promotion blocked.

## Expected Failure

candidate is described as runtime content before local proof, public proof, and human approval exist.

## Stop Condition

Stop if the candidate cannot move through this gate without bypassing source evidence, license evidence, style adaptation, protokit ownership, local proof, public proof, or approval policy.
