# Combat Cover Weapon Cues - Source Evidence

Status: active docs-only
Domain: combat / content / camera
Target kit: n:goldrush:combat-cover-protokits

## Purpose

prove the exact public source and intended file family before any local candidate copy for Combat Cover Weapon Cues.

## Player Problem

ambush pressure lacks readable cover and weapon silhouettes.

## Candidate Sources

Quaternius, Kenney.

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

- `combat-cover-weapon-cues.source-evidence.checked`
- `combat-cover-weapon-cues.source-evidence.blocked`
- `combat-cover-weapon-cues.source-evidence.readyForNextGate`

## Snapshot Seed

`{ candidateSet: 'combat-cover-weapon-cues', gate: 'source-evidence', state: 'planned', runtimePromotion: false }`

## Validation Gate

cover route, threat line, and combat receipt proof. This atom is complete only when the matching evidence exists and still keeps runtime promotion blocked.

## Expected Failure

candidate source is remembered, vague, or sourced from a mirror without creator proof.

## Stop Condition

Stop if the candidate cannot move through this gate without bypassing source evidence, license evidence, style adaptation, protokit ownership, local proof, public proof, or approval policy.
