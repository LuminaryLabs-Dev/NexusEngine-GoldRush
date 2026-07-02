# 006 - Train Motion State Contract Research

Status: planned docs-only
Parent atom: `011-rail-and-train-reference-contract`
Source field: `trainMotionStates`

## Purpose

Document the source signals and design implications for `trainMotionStates` before future implementation.

## Current Reference Signals

- Unreal Blueprint Splines: spline components and spline mesh components are established engine tools for path-authored objects and repeated meshes. Reference: https://dev.epicgames.com/documentation/unreal-engine/blueprint-splines-in-unreal-engine?lang=en-US
- Unity Splines manual: splines are used to generate objects and behaviors along paths, trajectories, and shapes. Reference: https://docs.unity3d.com/Packages/com.unity.splines%402.4/manual/index.html
- three.js CatmullRomCurve3 docs: browser runtime path sampling can use curve points for smooth 3D route representation. Reference: https://threejs.org/docs/pages/CatmullRomCurve3.html
- three.js TubeGeometry docs: geometry can be generated along a 3D curve, but path identity should still come from source data. Reference: https://threejs.org/docs/pages/TubeGeometry.html
- Apex Legends Season 3 Meltdown notes: a train can define a map fantasy, route identity, and onboarding destination in a battle-royale arena. Reference: https://forums.ea.com/blog/apex-legends-game-info-hub-en/season-3-meltdown-patch-notes/9458756
- Apex Legends Season 6 map updates: train routes, static cars, tunnels, loot, cover, and rotations show that rail features affect traversal and combat readability. Reference: https://forums.ea.com/blog/apex-legends-game-info-hub-en/season-6-map-updates/9462020
- GitHub Game Engines Collection: mature game stacks separate world data, rendering, physics, gameplay, audio, networking, and validation concerns. Reference: https://github.com/collections/game-engines

## Domain Implication

- World: the terrain source owns where rail lines exist, what direction they travel, where stops sit, and how rail features connect to the authored route web.
- Scene: train loading, boarding, departure, and match handoff consume route identity instead of creating isolated scene coordinates.
- Render: rail mesh, train body, platform props, and readable markers consume rail ids and anchors; they do not create rail identity.
- Control: camera handoff and player lock must follow one rail/motion source so cinematic and gameplay camera systems do not fight.
- Audio: train cues must bind to rail segment, phase, door, and distance state rather than timers alone.
- Validation: proof must fail when rail data is missing, stale, hardcoded, unowned, unreadable, or detached from camera/audio/boarding consumers.

## Data Implication

- Minimal config should contain ids, revision, control points, direction labels, stop anchors, door/platform sides, speed bands, sample proof points, and stale-proof policy.
- Public API should expose read-only rail sampling, stop lookup, direction label, motion state, and serializable consumer snapshots.
- Internal API may derive tangents, banking, sleepers, clearance, phase timing, camera target, cue distance, and proof samples behind the kit boundary.

## Edge Cases

- Direction labels are reversed between loading scene and match map.
- Train moves sideways because transform interpolation ignores the rail tangent.
- Door opens on the wrong side of the platform.
- Rail mesh appears on terrain but train collision or camera target uses another path.
- Audio fires from phase timers while train path, door side, or distance state has changed.
- Public proof reuses a stale train screenshot after the source rail revision changes.

## Implementation Question

What exact consumer echo proves `trainMotionStates` is source-owned and not inferred from a mesh, cinematic helper, timer, or local train curve?
