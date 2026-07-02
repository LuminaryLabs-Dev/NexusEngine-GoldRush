# Sky Atmosphere Material - Format Integrity

Status: active docs-only
Domain: render / world / art
Target kit: n:goldrush:toon-atmosphere-protokits

## Purpose

confirm the candidate format can enter a browser Three.js pipeline without unsafe conversion surprises for Sky Atmosphere Material.

## Player Problem

terrain and horizon need a coherent toon mood.

## Candidate Sources

Poly Haven, Kenney, authored material work.

## Atomic Scope

This packet covers only format integrity for this candidate set. It does not import, approve, promote, or place runtime assets.

## Data Contract Seed

- fileFormats
- fileCount
- expectedHash
- conversionNeeded
- reviewOnlyPathPolicy

## Public API Seed

`getCandidateGateStatus(candidateId, 'format-integrity')` should expose only safe status metadata, not local files or unapproved runtime paths.

## Internal API Seed

Private implementation may join source records, review records, conversion reports, or proof reports, but must keep unsafe paths and raw candidate details out of runtime-facing snapshots.

## Events Seed

- `sky-atmosphere-material.format-integrity.checked`
- `sky-atmosphere-material.format-integrity.blocked`
- `sky-atmosphere-material.format-integrity.readyForNextGate`

## Snapshot Seed

`{ candidateSet: 'sky-atmosphere-material', gate: 'format-integrity', state: 'planned', runtimePromotion: false }`

## Validation Gate

first-viewport horizon and mobile proof. This atom is complete only when the matching evidence exists and still keeps runtime promotion blocked.

## Expected Failure

candidate exists but format, download shape, or conversion route is unclear.

## Stop Condition

Stop if the candidate cannot move through this gate without bypassing source evidence, license evidence, style adaptation, protokit ownership, local proof, public proof, or approval policy.
