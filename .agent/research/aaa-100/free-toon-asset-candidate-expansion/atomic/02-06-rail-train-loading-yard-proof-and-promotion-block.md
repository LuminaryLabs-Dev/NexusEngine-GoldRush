# Rail Train Loading Yard - Proof And Promotion Block

Status: active docs-only
Domain: scene / world / transition
Target kit: n:goldrush:rail-train-protokits

## Purpose

define local/public proof and keep runtime promotion blocked until approval records exist for Rail Train Loading Yard.

## Player Problem

loading-yard sequence needs a believable train and track path.

## Candidate Sources

Quaternius, Poly Pizza, KayKit.

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

- `rail-train-loading-yard.proof-and-promotion-block.checked`
- `rail-train-loading-yard.proof-and-promotion-block.blocked`
- `rail-train-loading-yard.proof-and-promotion-block.readyForNextGate`

## Snapshot Seed

`{ candidateSet: 'rail-train-loading-yard', gate: 'proof-and-promotion-block', state: 'planned', runtimePromotion: false }`

## Validation Gate

boarding sequence screenshot and train motion proof. This atom is complete only when the matching evidence exists and still keeps runtime promotion blocked.

## Expected Failure

candidate is described as runtime content before local proof, public proof, and human approval exist.

## Stop Condition

Stop if the candidate cannot move through this gate without bypassing source evidence, license evidence, style adaptation, protokit ownership, local proof, public proof, or approval policy.
