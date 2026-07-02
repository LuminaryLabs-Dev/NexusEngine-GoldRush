# Mining Cargo Tools - Format Integrity Audit

Status: active docs-only
Domain: gameplay / content / interaction
Target kit: n:goldrush:mining-cargo-protokits

## Intention

Harden format integrity for the Mining Cargo Tools candidate set so free asset work moves GoldRush toward AAA toon western quality without unsafe imports or renderer-owned content.

## Architecture Boundary

`candidate source -> evidence -> candidate record -> style adaptation -> n:goldrush:mining-cargo-protokits -> proof -> approval -> runtime promotion`

The boundary is invalid if a candidate skips evidence, kit ownership, proof, or approval.

## Findings

| Finding | Why it matters | Hardening |
| --- | --- | --- |
| Source proof can drift | Asset pages and licenses can change | Capture dated source and license evidence before file work |
| Style fit is not automatic | Free toon packs still vary in scale, palette, and silhouette | Require adaptation notes before placement or cue use |
| Kit ownership can be skipped | Fast rendering/imports can hide logic in presentation code | Require n:goldrush:mining-cargo-protokits descriptor before consumer use |
| Proof can be too narrow | A model preview does not prove game improvement | Require mine to carry to cashout human-view proof |
| Runtime promotion pressure is high | Better looking assets are tempting to ship early | Keep runtime promotion false until review and public proof |

## Edge Cases

- The source page is valid but the downloaded archive includes extra unverified files.
- The candidate has a clear license but unclear authorship or mirrored origin.
- The asset fits the target kit but fails browser performance budgets.
- The asset improves one screenshot while hurting route, combat, mining, or cashout readability.
- A fallback procedural asset still appears in public proof and masks a missing candidate.

## Hardening Recommendation

Do not implement format integrity as a broad asset pass. Treat it as one gate for one candidate family. The next state should be a small evidence-backed candidate record and proof plan, not runtime content.

## Audit Rewrite

This atom is ready for implementation only when the source, license, format, style, protokit, and proof gates around it are all still coherent. If any neighboring gate is missing, continue docs/proof work before touching files.
