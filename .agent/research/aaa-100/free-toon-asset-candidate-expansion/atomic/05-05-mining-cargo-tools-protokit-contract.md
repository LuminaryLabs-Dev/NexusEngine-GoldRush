# Mining Cargo Tools - Protokit Contract

Status: active docs-only
Domain: gameplay / content / interaction
Target kit: n:goldrush:mining-cargo-protokits

## Purpose

assign the candidate to a local GoldRush kit with domain-owned public data and private implementation rules for Mining Cargo Tools.

## Player Problem

mine, carry, and cashout actions lack tactile object identity.

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

- `mining-cargo-tools.protokit-contract.checked`
- `mining-cargo-tools.protokit-contract.blocked`
- `mining-cargo-tools.protokit-contract.readyForNextGate`

## Snapshot Seed

`{ candidateSet: 'mining-cargo-tools', gate: 'protokit-contract', state: 'planned', runtimePromotion: false }`

## Validation Gate

mine to carry to cashout human-view proof. This atom is complete only when the matching evidence exists and still keeps runtime promotion blocked.

## Expected Failure

asset becomes renderer-owned content with no domain snapshot or gameplay meaning.

## Stop Condition

Stop if the candidate cannot move through this gate without bypassing source evidence, license evidence, style adaptation, protokit ownership, local proof, public proof, or approval policy.
