# Desert Rock And Plant - Protokit Contract

Status: active docs-only
Domain: world / render / physics
Target kit: n:goldrush:desert-rock-plant-protokits

## Purpose

assign the candidate to a local GoldRush kit with domain-owned public data and private implementation rules for Desert Rock And Plant.

## Player Problem

terrain reads empty, flat, and low scale.

## Candidate Sources

Kenney, Quaternius, KayKit.

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

- `desert-rock-plant.protokit-contract.checked`
- `desert-rock-plant.protokit-contract.blocked`
- `desert-rock-plant.protokit-contract.readyForNextGate`

## Snapshot Seed

`{ candidateSet: 'desert-rock-plant', gate: 'protokit-contract', state: 'planned', runtimePromotion: false }`

## Validation Gate

raycast placement plus scale screenshots. This atom is complete only when the matching evidence exists and still keeps runtime promotion blocked.

## Expected Failure

asset becomes renderer-owned content with no domain snapshot or gameplay meaning.

## Stop Condition

Stop if the candidate cannot move through this gate without bypassing source evidence, license evidence, style adaptation, protokit ownership, local proof, public proof, or approval policy.
