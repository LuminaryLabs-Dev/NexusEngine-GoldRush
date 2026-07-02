# Prop Protokit Consumer Contract

Status: active docs-only

Packet: 017
Domain: render plus world
Target kit: n:render:micro-object-instancing plus GoldRush prop protokits
Roadmap atoms: 040

## Purpose

Define how individual rocks, plants, rails, towns, mines, towers, gold seams, crates, and camp objects become small kit-owned consumers.

## Why This Prevents Plateau

More procedural props add noise unless each meaningful object has a protokit, authored placement rule, identity, interaction role, and proof.

## Data Exposed

- protokitId
- objectClass
- anchorClass
- meshRecipe
- materialRole
- collisionRole
- interactionRole
- lodRole

## Public API Shape

- registerPropProtokit(descriptor)
- buildInstancesFromAnchors(className)
- getPropKitSnapshot()

## Events And Snapshot

- propProtokitRegistered
- propInstancesBuilt
- propPlacementRejected

Snapshot must include the target kit, source revision, consumer revision, validation state, and enough domain state to debug without leaking machine-local paths.

## Validation And Proof

- CLI verifies every prop class has a descriptor and anchor rule
- screenshot proof checks landmark, cover, resource, and clutter readability

## Edge Cases And Stop Conditions

- Do not make 1000 micro-kits as unowned files without contracts.
- Do not instantiate props before raycast grounding.
- Stop if collision, interaction, and render identity diverge for the same object.

## Implementation Note

Do not code from this packet alone. Read the parent authored terrain spec, the matching atomic map packet, the matching four research packets, the implementation simulation, and the hardening audit before editing runtime files.
