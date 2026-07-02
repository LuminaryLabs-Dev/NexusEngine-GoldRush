# 07 Audio SFX Music Source Set

Status: active docs-only

## Purpose

Replace weak procedural cue beds with source-backed cue candidates while preserving semantic audio-state ownership.

## Candidate Sources

| Source | Candidate role | Current evidence |
| --- | --- | --- |
| Kenney Impact Sounds | impacts, mining hits, body/object feedback | page lists 130 audio files with Creative Commons CC0 license |
| Kenney audio category | UI, RPG, interface, digital, music jingle candidates | source page groups multiple audio asset packs |
| OpenGameArt CC0 Music | menu, pressure, ambience, battle loop candidates | CC0 music collection lists many loop and ambience entries |
| Freesound CC0 filter | one-shot field recordings and foley | use only item-level CC0 evidence and source screenshot |
| Pixabay | fallback free audio source | not CC0; use only with project-approved content-license review |

## Target Kit

`n:goldrush:audio-candidate-protokits`

## Data Exposed

- cue id.
- source candidate id.
- cue family.
- one-shot or loop role.
- semantic state.
- fallback cue id.
- loudness target.
- proof event.

## Cue Families

| Cue | Needed for |
| --- | --- |
| title music | start screen identity |
| lobby click/ready | party flow feedback |
| train arrival/door/board/depart | first sequence readability |
| mining hit/complete | hold interaction feedback |
| cargo pickup/drop | carrying loop feedback |
| cashout start/complete/interrupt | extraction stakes |
| ambush warning/hit/cover | combat readability |
| results sting | extraction payoff |

## Rejection Rule

Reject audio candidates that have unclear license, unclear cue role, noisy loops, humming fatigue, or no fallback mapping.

