# Desert Rock And Plant - Source Evidence

Status: active docs-only
Domain: world / render / physics
Target kit: n:goldrush:desert-rock-plant-protokits

## Purpose

prove the exact public source and intended file family before any local candidate copy for Desert Rock And Plant.

## Player Problem

terrain reads empty, flat, and low scale.

## Candidate Sources

Kenney, Quaternius, KayKit.

## Atomic Scope

This packet covers only source evidence for this candidate set. It does not import, approve, promote, or place runtime assets.

## Data Contract Seed

- sourceUrl
- creator
- packName
- candidateFamily
- retrievedDate

## Public API Seed

`getCandidateGateStatus(candidateId, 'source-evidence')` should expose only safe status metadata, not local files or unapproved runtime paths.

## Internal API Seed

Private implementation may join source records, review records, conversion reports, or proof reports, but must keep unsafe paths and raw candidate details out of runtime-facing snapshots.

## Events Seed

- `desert-rock-plant.source-evidence.checked`
- `desert-rock-plant.source-evidence.blocked`
- `desert-rock-plant.source-evidence.readyForNextGate`

## Snapshot Seed

`{ candidateSet: 'desert-rock-plant', gate: 'source-evidence', state: 'planned', runtimePromotion: false }`

## Validation Gate

raycast placement plus scale screenshots. This atom is complete only when the matching evidence exists and still keeps runtime promotion blocked.

## Expected Failure

candidate source is remembered, vague, or sourced from a mirror without creator proof.

## Stop Condition

Stop if the candidate cannot move through this gate without bypassing source evidence, license evidence, style adaptation, protokit ownership, local proof, public proof, or approval policy.
