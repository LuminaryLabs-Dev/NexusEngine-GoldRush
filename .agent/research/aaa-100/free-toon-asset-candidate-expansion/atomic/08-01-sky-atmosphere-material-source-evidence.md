# Sky Atmosphere Material - Source Evidence

Status: active docs-only
Domain: render / world / art
Target kit: n:goldrush:toon-atmosphere-protokits

## Purpose

prove the exact public source and intended file family before any local candidate copy for Sky Atmosphere Material.

## Player Problem

terrain and horizon need a coherent toon mood.

## Candidate Sources

Poly Haven, Kenney, authored material work.

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

- `sky-atmosphere-material.source-evidence.checked`
- `sky-atmosphere-material.source-evidence.blocked`
- `sky-atmosphere-material.source-evidence.readyForNextGate`

## Snapshot Seed

`{ candidateSet: 'sky-atmosphere-material', gate: 'source-evidence', state: 'planned', runtimePromotion: false }`

## Validation Gate

first-viewport horizon and mobile proof. This atom is complete only when the matching evidence exists and still keeps runtime promotion blocked.

## Expected Failure

candidate source is remembered, vague, or sourced from a mirror without creator proof.

## Stop Condition

Stop if the candidate cannot move through this gate without bypassing source evidence, license evidence, style adaptation, protokit ownership, local proof, public proof, or approval policy.
