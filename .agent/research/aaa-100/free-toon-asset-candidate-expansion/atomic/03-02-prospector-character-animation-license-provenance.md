# Prospector Character Animation - License Provenance

Status: active docs-only
Domain: character / control / animation
Target kit: n:goldrush:prospector-character-protokits

## Purpose

prove use rights for the exact candidate file or pack before import planning for Prospector Character Animation.

## Player Problem

current rig is too prototype-like for AAA player feel.

## Candidate Sources

Quaternius, KayKit.

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

- `prospector-character-animation.license-provenance.checked`
- `prospector-character-animation.license-provenance.blocked`
- `prospector-character-animation.license-provenance.readyForNextGate`

## Snapshot Seed

`{ candidateSet: 'prospector-character-animation', gate: 'license-provenance', state: 'planned', runtimePromotion: false }`

## Validation Gate

lobby spin and over-shoulder movement proof. This atom is complete only when the matching evidence exists and still keeps runtime promotion blocked.

## Expected Failure

free, royalty-free, or CC0 is assumed from the site brand instead of the item page.

## Stop Condition

Stop if the candidate cannot move through this gate without bypassing source evidence, license evidence, style adaptation, protokit ownership, local proof, public proof, or approval policy.
