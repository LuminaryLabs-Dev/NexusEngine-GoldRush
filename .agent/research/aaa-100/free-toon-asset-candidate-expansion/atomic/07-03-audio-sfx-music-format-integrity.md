# Audio SFX Music - Format Integrity

Status: active docs-only
Domain: audio / presentation / gameplay
Target kit: n:goldrush:audio-candidate-protokits

## Purpose

confirm the candidate format can enter a browser Three.js pipeline without unsafe conversion surprises for Audio SFX Music.

## Player Problem

semantic cue-state needs stronger sound sources without humming fatigue.

## Candidate Sources

Kenney, OpenGameArt, Freesound CC0, Pixabay caution.

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

- `audio-sfx-music.format-integrity.checked`
- `audio-sfx-music.format-integrity.blocked`
- `audio-sfx-music.format-integrity.readyForNextGate`

## Snapshot Seed

`{ candidateSet: 'audio-sfx-music', gate: 'format-integrity', state: 'planned', runtimePromotion: false }`

## Validation Gate

cue-state playback proof and fallback parity. This atom is complete only when the matching evidence exists and still keeps runtime promotion blocked.

## Expected Failure

candidate exists but format, download shape, or conversion route is unclear.

## Stop Condition

Stop if the candidate cannot move through this gate without bypassing source evidence, license evidence, style adaptation, protokit ownership, local proof, public proof, or approval policy.
