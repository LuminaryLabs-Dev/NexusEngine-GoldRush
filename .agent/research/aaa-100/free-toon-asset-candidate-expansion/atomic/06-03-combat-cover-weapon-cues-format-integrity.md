# Combat Cover Weapon Cues - Format Integrity

Status: active docs-only
Domain: combat / content / camera
Target kit: n:goldrush:combat-cover-protokits

## Purpose

confirm the candidate format can enter a browser Three.js pipeline without unsafe conversion surprises for Combat Cover Weapon Cues.

## Player Problem

ambush pressure lacks readable cover and weapon silhouettes.

## Candidate Sources

Quaternius, Kenney.

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

- `combat-cover-weapon-cues.format-integrity.checked`
- `combat-cover-weapon-cues.format-integrity.blocked`
- `combat-cover-weapon-cues.format-integrity.readyForNextGate`

## Snapshot Seed

`{ candidateSet: 'combat-cover-weapon-cues', gate: 'format-integrity', state: 'planned', runtimePromotion: false }`

## Validation Gate

cover route, threat line, and combat receipt proof. This atom is complete only when the matching evidence exists and still keeps runtime promotion blocked.

## Expected Failure

candidate exists but format, download shape, or conversion route is unclear.

## Stop Condition

Stop if the candidate cannot move through this gate without bypassing source evidence, license evidence, style adaptation, protokit ownership, local proof, public proof, or approval policy.
