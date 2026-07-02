# Mining Cargo Tools - Format Integrity

Status: active docs-only
Domain: gameplay / content / interaction
Target kit: n:goldrush:mining-cargo-protokits

## Purpose

confirm the candidate format can enter a browser Three.js pipeline without unsafe conversion surprises for Mining Cargo Tools.

## Player Problem

mine, carry, and cashout actions lack tactile object identity.

## Candidate Sources

Kenney, Quaternius, KayKit.

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

- `mining-cargo-tools.format-integrity.checked`
- `mining-cargo-tools.format-integrity.blocked`
- `mining-cargo-tools.format-integrity.readyForNextGate`

## Snapshot Seed

`{ candidateSet: 'mining-cargo-tools', gate: 'format-integrity', state: 'planned', runtimePromotion: false }`

## Validation Gate

mine to carry to cashout human-view proof. This atom is complete only when the matching evidence exists and still keeps runtime promotion blocked.

## Expected Failure

candidate exists but format, download shape, or conversion route is unclear.

## Stop Condition

Stop if the candidate cannot move through this gate without bypassing source evidence, license evidence, style adaptation, protokit ownership, local proof, public proof, or approval policy.
