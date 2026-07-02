# Prospector Character Animation - Toon Style Adaptation

Status: active docs-only
Domain: character / control / animation
Target kit: n:goldrush:prospector-character-protokits

## Purpose

define how the asset will match GoldRush toon western palette, scale, silhouette, and material roles for Prospector Character Animation.

## Player Problem

current rig is too prototype-like for AAA player feel.

## Candidate Sources

Quaternius, KayKit.

## Atomic Scope

This packet covers only toon style adaptation for this candidate set. It does not import, approve, promote, or place runtime assets.

## Data Contract Seed

- paletteRole
- materialRole
- scaleBand
- silhouetteGoal
- rejectionReason

## Public API Seed

`getCandidateGateStatus(candidateId, 'toon-style-adaptation')` should expose only safe status metadata, not local files or unapproved runtime paths.

## Internal API Seed

Private implementation may join source records, review records, conversion reports, or proof reports, but must keep unsafe paths and raw candidate details out of runtime-facing snapshots.

## Events Seed

- `prospector-character-animation.toon-style-adaptation.checked`
- `prospector-character-animation.toon-style-adaptation.blocked`
- `prospector-character-animation.toon-style-adaptation.readyForNextGate`

## Snapshot Seed

`{ candidateSet: 'prospector-character-animation', gate: 'toon-style-adaptation', state: 'planned', runtimePromotion: false }`

## Validation Gate

lobby spin and over-shoulder movement proof. This atom is complete only when the matching evidence exists and still keeps runtime promotion blocked.

## Expected Failure

candidate looks good alone but clashes with the world, player camera, or terrain palette.

## Stop Condition

Stop if the candidate cannot move through this gate without bypassing source evidence, license evidence, style adaptation, protokit ownership, local proof, public proof, or approval policy.
