# Candidate Source Policy

Status: active docs-only

## Purpose

Define how GoldRush can research useful assets without accidentally approving them.

## Candidate Sources

- Kenney support/license notes: https://kenney.nl/support
- Quaternius free asset catalog: https://quaternius.com/
- Poly Haven license: https://polyhaven.com/license
- OpenGameArt FAQ: https://opengameart.org/content/faq

## Policy

- Kenney, Quaternius, Poly Haven, OpenGameArt, and similar libraries are source candidates only.
- CC0-friendly source channels still need per-pack or per-item evidence in this repo.
- OpenGameArt must always be item-level because community uploads can vary by license and attribution requirements.
- Poly Haven is useful for HDRI, texture, and reference material, but realistic material sources need toon adaptation.
- Quaternius and Kenney are useful for stylized game-ready shapes, but scale, pivot, collider, animation, and performance still need proof.
- No source candidate may write to runtime paths by default.
- No source candidate may bypass human review because of reputation or convenience.

## Source Candidate Output

A candidate packet may only expose:

- candidate id.
- source URL.
- source family.
- intended GoldRush family.
- license evidence status.
- provenance evidence status.
- runtime promotion false.

