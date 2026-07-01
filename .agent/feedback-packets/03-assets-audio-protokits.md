# Assets Audio Protokits Feedback

Status: active

## Purpose

Preserve user corrections about assets, procedural generation, audio, and protokit boundaries.

## Feedback

- Only edit/add kits inside `NexusEngine-GoldRush`.
- Do not clone other repos locally for this goal.
- If assets must move from old projects or kit repos, ask GPT-it/cloud-side work to move them into this repo.
- Use actual Gold Rush audio from old projects only after finding where it was used and moving it through the approval pipeline.
- Procedural assets are acceptable, but each meaningful item should be its own stable object protokit.
- Procedural generation should be layered and always work: source descriptor -> environment space -> placement raycast -> visual batch -> interaction affordance -> proof.
- Avoid generic primitives as the final look; prototype primitives are temporary scaffolding only.
- Find open-source GLBs only when license/provenance can be stored locally and no external installer is required.

## Required Proof

- Object protokit descriptors expose domain, placement, visual form, interaction affordance, and debug provenance.
- Renderer batches visuals but does not own gameplay rules.
- Asset/audio runtime use flows through approved registry paths only.
- Validators block raw/sanitized/unapproved assets from runtime promotion.
