# Frontier Town And Camp Props - Source Evidence

Status: active docs-only
Domain: content / world / combat
Target kit: n:goldrush:frontier-setpiece-protokits

## Purpose

prove the exact public source and intended file family before any local candidate copy for Frontier Town And Camp Props.

## Player Problem

POIs lack readable western identity.

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

- `frontier-town-camp-props.source-evidence.checked`
- `frontier-town-camp-props.source-evidence.blocked`
- `frontier-town-camp-props.source-evidence.readyForNextGate`

## Snapshot Seed

`{ candidateSet: 'frontier-town-camp-props', gate: 'source-evidence', state: 'planned', runtimePromotion: false }`

## Validation Gate

town shelf and camp route screenshots. This atom is complete only when the matching evidence exists and still keeps runtime promotion blocked.

## Expected Failure

candidate source is remembered, vague, or sourced from a mirror without creator proof.

## Stop Condition

Stop if the candidate cannot move through this gate without bypassing source evidence, license evidence, style adaptation, protokit ownership, local proof, public proof, or approval policy.
