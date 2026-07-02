# Why The Map Is Plateauing

Status: active docs-only

## Diagnosis

GoldRush is not plateauing because it lacks another primitive, another scatter pass, or a larger numeric terrain size. It is plateauing because the map does not yet have an authored source asset with durable place identity.

## Current Symptom

The scene can show a player, terrain, mountains, tracks, rings, object markers, and extraction cues, but the world still reads as a generated test area because many pieces are locally correct while the total space is not authored as one map.

## Root Causes

- The macro terrain shape is not yet source-authored.
- LOD, collider, gameplay zones, and object placement are not all proven from one source revision.
- Asset families are still mostly placeholder/procedural vocabulary instead of a terrain-grounded prop language.
- Combat, cashout, gold, route, and train spaces are not visually authored together.
- Proof can show systems working without proving the world feels like a large battle-royale extraction map.

## Design Consequence

Scaling the current terrain by 4x or adding more small objects can make the map bigger, but not better. A massive desert map needs source-drawn basins, ridges, shelves, route webs, silhouettes, and anchors before procedural object kits can elevate it.

## Required Pivot

Move terrain work from procedural-first to source-first:

```txt
source map art/data -> terrain mesh chunks -> collider samples -> raycast anchors -> object protokits -> gameplay masks -> proof
```

## Acceptance

The plateau is broken only when a player can stand in the map and read:

- where they came from
- where the train/settlement/mine/cashout is
- what the central obstacle means
- where a risky shortcut is
- where cover and sightlines are
- why the world is a frontier gold field, not a test grid
