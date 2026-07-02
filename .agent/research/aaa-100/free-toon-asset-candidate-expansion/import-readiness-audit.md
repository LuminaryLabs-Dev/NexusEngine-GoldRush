# Import Readiness Audit

Status: active docs-only

## Intention

Prepare GoldRush for higher-fidelity free toon assets without weakening the existing safety boundary between candidate source, reviewed content, and approved runtime content.

## Architecture

The correct architecture is a staged content pipeline:

```txt
candidate source
-> candidate manifest
-> review copy
-> style adaptation
-> protokit descriptor
-> terrain/cue consumer
-> human review
-> runtime promotion
-> local/public proof
```

GoldRush should not import directly into gameplay. The candidate enters the repo as evidence first, then becomes a kit-owned asset only after proof.

## Human-View Evidence

Current visual feedback shows the world has stronger terrain shape than before, but still lacks the asset variety, scale, readable character body, and environmental identity expected from a polished battle royale extraction game. This packet is unverified for final visuals until candidate screenshots exist.

## Findings

| Finding | Impact | Hardening |
| --- | --- | --- |
| Asset families are named, but source sets are not yet prioritized | implementation may bulk-import unfocused assets | pick one family and one fixture first |
| Toon style is not yet enforced at candidate level | free packs could clash visually | require palette/material/scale adaptation record |
| Character quality is still a major trust gap | movement and lobby may read as prototype even if map improves | prioritize rigged prospector candidate and animation proof |
| Train sequence needs stronger asset identity | the first cinematic handoff can feel fake | prioritize train/rail set with motion and boarding proof |
| Audio candidates are high-risk without cue mapping | random sounds can weaken state readability | map every sound to semantic cue-state before use |
| License clarity varies by source | legal or distribution risk | require source-page evidence per item |

## Long-Term Impact

If asset intake stays loose, the game will plateau into either primitive procedural art or unsafe imported content. If the pipeline is strict, GoldRush can gradually increase fidelity while keeping every object kit-owned, replayable, and deployable.

## Hardening

- Use CC0 or similarly clear free-use sources as the default.
- Prefer sources with direct GLTF/GLB, FBX, OBJ, OGG, or WAV evidence.
- Keep item-level license records for every candidate.
- Keep runtime promotion blocked until human review and public proof pass.
- Reject any candidate with unclear origin, unclear license, unclear target kit, or no player-facing proof.

## Audit Rewrite

The next asset pass should be a single-family proof, not an import wave. Best first candidate is desert rock/plant or rail/train, because both directly address the current plateau: the world needs scale and the first sequence needs a believable signature object.

