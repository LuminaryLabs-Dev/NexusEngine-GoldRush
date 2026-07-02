# Rail Train Loading Yard - License Provenance

Status: active docs-only
Domain: scene / world / transition
Target kit: n:goldrush:rail-train-protokits

## Purpose

prove use rights for the exact candidate file or pack before import planning for Rail Train Loading Yard.

## Player Problem

loading-yard sequence needs a believable train and track path.

## Candidate Sources

Quaternius, Poly Pizza, KayKit.

## Atomic Scope

This packet covers only license provenance for this candidate set. It does not import, approve, promote, or place runtime assets.

## Data Contract Seed

- licenseUrl
- licenseName
- freeUseNote
- attributionRequirement
- blockedTerms

## Public API Seed

`getCandidateGateStatus(candidateId, 'license-provenance')` should expose only safe status metadata, not local files or unapproved runtime paths.

## Internal API Seed

Private implementation may join source records, review records, conversion reports, or proof reports, but must keep unsafe paths and raw candidate details out of runtime-facing snapshots.

## Events Seed

- `rail-train-loading-yard.license-provenance.checked`
- `rail-train-loading-yard.license-provenance.blocked`
- `rail-train-loading-yard.license-provenance.readyForNextGate`

## Snapshot Seed

`{ candidateSet: 'rail-train-loading-yard', gate: 'license-provenance', state: 'planned', runtimePromotion: false }`

## Validation Gate

boarding sequence screenshot and train motion proof. This atom is complete only when the matching evidence exists and still keeps runtime promotion blocked.

## Expected Failure

free, royalty-free, or CC0 is assumed from the site brand instead of the item page.

## Stop Condition

Stop if the candidate cannot move through this gate without bypassing source evidence, license evidence, style adaptation, protokit ownership, local proof, public proof, or approval policy.
