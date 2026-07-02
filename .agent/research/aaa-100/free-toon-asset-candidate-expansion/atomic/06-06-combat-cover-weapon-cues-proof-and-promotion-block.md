# Combat Cover Weapon Cues - Proof And Promotion Block

Status: active docs-only
Domain: combat / content / camera
Target kit: n:goldrush:combat-cover-protokits

## Purpose

define local/public proof and keep runtime promotion blocked until approval records exist for Combat Cover Weapon Cues.

## Player Problem

ambush pressure lacks readable cover and weapon silhouettes.

## Candidate Sources

Quaternius, Kenney.

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

- `combat-cover-weapon-cues.proof-and-promotion-block.checked`
- `combat-cover-weapon-cues.proof-and-promotion-block.blocked`
- `combat-cover-weapon-cues.proof-and-promotion-block.readyForNextGate`

## Snapshot Seed

`{ candidateSet: 'combat-cover-weapon-cues', gate: 'proof-and-promotion-block', state: 'planned', runtimePromotion: false }`

## Validation Gate

cover route, threat line, and combat receipt proof. This atom is complete only when the matching evidence exists and still keeps runtime promotion blocked.

## Expected Failure

candidate is described as runtime content before local proof, public proof, and human approval exist.

## Stop Condition

Stop if the candidate cannot move through this gate without bypassing source evidence, license evidence, style adaptation, protokit ownership, local proof, public proof, or approval policy.
