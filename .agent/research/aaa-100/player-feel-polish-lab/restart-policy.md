# Restart Policy

Status: active docs-only

## Purpose

Define when a feel implementation should stop, restart, or create a new local kit instead of patching the wrong surface.

## Restart Triggers

- The renderer becomes the source of gameplay meaning.
- More than one system writes camera transform in a frame.
- Movement proof needs direct placement helpers to pass.
- Terrain visual height and collider height diverge.
- A player-facing action lacks audio, body, VFX, cue, or receipt.
- A validator passes while human-view capture remains confusing.
- A public build differs from local proof.
- A feature only works in one scene and breaks across transition.

## New Kit Trigger

If a concern becomes too simple, overloaded, or hard to reason about in an existing kit, create a new local GoldRush kit with a narrow domainPath and proof gate. Do not create or edit external NexusRealtime repos from this workflow.
