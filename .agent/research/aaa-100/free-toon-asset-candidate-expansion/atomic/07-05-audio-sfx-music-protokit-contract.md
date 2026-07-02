# Audio SFX Music - Protokit Contract

Status: active docs-only
Domain: audio / presentation / gameplay
Target kit: n:goldrush:audio-candidate-protokits

## Purpose

assign the candidate to a local GoldRush kit with domain-owned public data and private implementation rules for Audio SFX Music.

## Player Problem

semantic cue-state needs stronger sound sources without humming fatigue.

## Candidate Sources

Kenney, OpenGameArt, Freesound CC0, Pixabay caution.

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

- `audio-sfx-music.protokit-contract.checked`
- `audio-sfx-music.protokit-contract.blocked`
- `audio-sfx-music.protokit-contract.readyForNextGate`

## Snapshot Seed

`{ candidateSet: 'audio-sfx-music', gate: 'protokit-contract', state: 'planned', runtimePromotion: false }`

## Validation Gate

cue-state playback proof and fallback parity. This atom is complete only when the matching evidence exists and still keeps runtime promotion blocked.

## Expected Failure

asset becomes renderer-owned content with no domain snapshot or gameplay meaning.

## Stop Condition

Stop if the candidate cannot move through this gate without bypassing source evidence, license evidence, style adaptation, protokit ownership, local proof, public proof, or approval policy.
