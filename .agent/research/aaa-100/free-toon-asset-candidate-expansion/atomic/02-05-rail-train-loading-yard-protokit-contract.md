# Rail Train Loading Yard - Protokit Contract

Status: active docs-only
Domain: scene / world / transition
Target kit: n:goldrush:rail-train-protokits

## Purpose

assign the candidate to a local GoldRush kit with domain-owned public data and private implementation rules for Rail Train Loading Yard.

## Player Problem

loading-yard sequence needs a believable train and track path.

## Candidate Sources

Quaternius, Poly Pizza, KayKit.

## Atomic Scope

This packet covers only protokit contract for this candidate set. It does not import, approve, promote, or place runtime assets.

## Data Contract Seed

- domainPath
- publicSnapshot
- placementRole
- interactionRole
- events

## Public API Seed

`getCandidateGateStatus(candidateId, 'protokit-contract')` should expose only safe status metadata, not local files or unapproved runtime paths.

## Internal API Seed

Private implementation may join source records, review records, conversion reports, or proof reports, but must keep unsafe paths and raw candidate details out of runtime-facing snapshots.

## Events Seed

- `rail-train-loading-yard.protokit-contract.checked`
- `rail-train-loading-yard.protokit-contract.blocked`
- `rail-train-loading-yard.protokit-contract.readyForNextGate`

## Snapshot Seed

`{ candidateSet: 'rail-train-loading-yard', gate: 'protokit-contract', state: 'planned', runtimePromotion: false }`

## Validation Gate

boarding sequence screenshot and train motion proof. This atom is complete only when the matching evidence exists and still keeps runtime promotion blocked.

## Expected Failure

asset becomes renderer-owned content with no domain snapshot or gameplay meaning.

## Stop Condition

Stop if the candidate cannot move through this gate without bypassing source evidence, license evidence, style adaptation, protokit ownership, local proof, public proof, or approval policy.
