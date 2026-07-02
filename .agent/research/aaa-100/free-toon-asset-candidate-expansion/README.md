# Free Toon Asset Candidate Expansion

Status: active docs-only
Date: 2026-07-01
Domain: content / art direction / audio / render / gameplay / validation

## Purpose

Define the next safe asset research layer for high-fidelity toon GoldRush. This packet does not import or approve assets. It records current candidate sources, kit-fit decisions, and gates needed before any candidate can become runtime content.

## Current Intention

GoldRush should stop looking like a procedural prototype by adding real, coherent, toon-shaded western asset families. The assets must still behave like kits: every object family needs a domain owner, placement rule, collision or interaction role, event/snapshot surface where needed, and human-view proof.

## Why This Exists Now

The terrain-source work explains the map plateau. This packet explains the content plateau: even a better terrain mesh will feel empty unless the rocks, plants, train, town, mine, cargo, character, cover, audio, and sky families become source-backed protokits.

## Source Rule

Candidate source does not equal approved content. A candidate can only move forward after source evidence, license evidence, provenance record, file integrity record, style adaptation plan, protokit contract, placement proof, performance budget, human review, and local/public browser proof.

## Candidate Sets

| Set | Packet | Primary use | Candidate sources | First owning kit |
| --- | --- | --- | --- | --- |
| 01 | `sets/01-desert-rock-plant-source-set.md` | desert scatter, cover, route readability | Kenney, Quaternius, KayKit | `n:goldrush:desert-rock-plant-protokits` |
| 02 | `sets/02-rail-train-loading-yard-source-set.md` | title-to-match train sequence | Quaternius, Poly Pizza, KayKit | `n:goldrush:rail-train-protokits` |
| 03 | `sets/03-prospector-character-animation-source-set.md` | playable character, lobby preview, bots | Quaternius, KayKit | `n:goldrush:prospector-character-protokits` |
| 04 | `sets/04-frontier-town-camp-props-source-set.md` | towns, camps, mine shelves, cover spaces | Kenney, Quaternius, KayKit | `n:goldrush:frontier-setpiece-protokits` |
| 05 | `sets/05-mining-cargo-tools-source-set.md` | mine, carry, deposit interactions | Kenney, Quaternius, KayKit | `n:goldrush:mining-cargo-protokits` |
| 06 | `sets/06-combat-cover-weapon-cues-source-set.md` | ambush readability, cover, weapon silhouettes | Quaternius, Kenney | `n:goldrush:combat-cover-protokits` |
| 07 | `sets/07-audio-sfx-music-source-set.md` | train, mining, cargo, cashout, UI, combat cues | Kenney, OpenGameArt, Freesound CC0, Pixabay caution | `n:goldrush:audio-candidate-protokits` |
| 08 | `sets/08-sky-atmosphere-material-source-set.md` | toon sky, terrain material, horizon mood | Poly Haven, Kenney, authored material work | `n:goldrush:toon-atmosphere-protokits` |

## Research Files

- `candidate-set-matrix.md`
- `atomic-matrix.md`
- `atomic-research-matrix.md`
- `simulation-matrix.md`
- `audit-matrix.md`
- `style-adaptation-policy.md`
- `proof-gates.md`
- `import-readiness-audit.md`
- `research/source-reference-matrix.md`
- `research/license-risk-matrix.md`
- `research/implementation-simulation.md`
- `research/hardening-audit.md`

## Atomic Layer

The candidate expansion is now split into 48 implementation atoms and 48 paired research packets. Each candidate set has six gates: source evidence, license provenance, format integrity, toon style adaptation, protokit contract, and proof/promotion block.

## Simulation And Audit Layer

Every candidate atom now has an implementation simulation and a hardening audit. Future implementation should read the candidate set, atom, paired research packet, simulation, and audit before touching candidate files or kit code.

## First Implementation Slice Later

When implementation resumes, do not bulk import. Pick one tiny set:

```txt
desert rock / cactus candidate
-> source evidence
-> license evidence
-> local candidate record
-> protokit descriptor
-> terrain mask placement
-> collider or readability role
-> local screenshot proof
-> public screenshot proof
```

## Stop Conditions

- Stop if the source page does not show clear free-use or license terms.
- Stop if a file needs login, purchase, Discord-only access, or manual claim before direct evidence is captured.
- Stop if the asset cannot be tied to a kit owner.
- Stop if placement would be renderer-only instead of terrain/raycast owned.
- Stop if the candidate would bypass review and become runtime content directly.
