# Hardening Audit

Status: active docs-only

## Intention

Move GoldRush toward AAA toon western fidelity while keeping the repo safe, restartable, and kit-first.

## Architecture Boundary

Assets must move through this boundary:

```txt
source candidate
-> evidence
-> candidate record
-> kit descriptor
-> placement/cue consumer
-> proof
-> approval
-> runtime content
```

Skipping any step creates fragile content.

## Findings

| Finding | Why it matters | Hardening |
| --- | --- | --- |
| Candidate sources are easier to find than to integrate | download volume can hide missing gameplay value | start with one kit-owned family |
| Visual style can drift fast | CC0 packs have different proportions and material styles | enforce toon palette/material/scale policy |
| Character import is deceptively hard | rig, animation, scale, camera, and controls must agree | require lobby spin plus movement proof |
| Train import can break sequence timing | model origin/door/path mismatch can reintroduce motion bugs | require path, door, boarding, and departure proof |
| Audio licensing can look simpler than it is | royalty-free is not always CC0 | prefer CC0 and require cue-state mapping |
| Source evidence can go stale | pages and terms can change | store date, source URL, license URL, and file hashes |

## Edge Cases

- Train model has no usable door anchor.
- Track scale does not match current train path.
- Character has animations but no grounded foot contact.
- Rock meshes block movement but do not register as cover.
- Cactus/plant scatter hides gold or cashout cues.
- Music loop creates fatigue or masks combat warning cues.
- Asset looks good locally but is missing from public proof.
- Candidate page allows free use but not standalone redistribution.

## Audit Rewrite

The next implementation pass should not ask "what assets can we import?" It should ask "which one candidate family proves the GoldRush source-to-kit-to-proof pipeline?" The best first proof is either desert rock/plant placement or train/rail boarding because both are visible, domain-owned, and directly address current player-view plateau.

