# Audio SFX Music - License Provenance

Status: active docs-only
Domain: audio / presentation / gameplay
Target kit: n:goldrush:audio-candidate-protokits

## Purpose

prove use rights for the exact candidate file or pack before import planning for Audio SFX Music.

## Player Problem

semantic cue-state needs stronger sound sources without humming fatigue.

## Candidate Sources

Kenney, OpenGameArt, Freesound CC0, Pixabay caution.

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

- `audio-sfx-music.license-provenance.checked`
- `audio-sfx-music.license-provenance.blocked`
- `audio-sfx-music.license-provenance.readyForNextGate`

## Snapshot Seed

`{ candidateSet: 'audio-sfx-music', gate: 'license-provenance', state: 'planned', runtimePromotion: false }`

## Validation Gate

cue-state playback proof and fallback parity. This atom is complete only when the matching evidence exists and still keeps runtime promotion blocked.

## Expected Failure

free, royalty-free, or CC0 is assumed from the site brand instead of the item page.

## Stop Condition

Stop if the candidate cannot move through this gate without bypassing source evidence, license evidence, style adaptation, protokit ownership, local proof, public proof, or approval policy.
