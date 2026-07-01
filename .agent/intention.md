# Intention

Status: active

## Purpose

Build `NexusEngine-GoldRush` into a high-fidelity wild-west extraction battle royale through NexusRealtime-style kit composition, staged legacy asset sanitation, and repeated human-view validation.

## Chat-Derived Product Intent

The user is trying to make `Gold Rush` a real browser-playable extraction battle royale, not a tech demo. The game should feel like a western gold-field expedition with a party lobby, train transition, large terrain, over-the-shoulder character control, mining, carrying gold, pressure/combat, cashout, scoring, and results.

The user repeatedly corrected the direction away from:

- circular arenas.
- primitive-only placeholder scenes.
- renderer-owned hidden game logic.
- shard UI as the main design focus.
- debug overlays as the main player surface.
- cloned local source repos outside this destination repo.

The expected agent posture is: find the domain, find the kit, make a concrete improvement, prove it in browser/runtime state, record it in `.agent`, then continue.

## Current Posture

- Move the playable game forward each turn.
- Keep the current architecture kit-first: generic incubator kits expose reusable mechanics, GoldRush kits own game-specific rules.
- Document AAA, market, and player-experience gaps as agent packets so future implementation passes can target the right missing system.
- Do not treat raw or sanitized legacy assets as runtime assets until approval gates pass.
- Treat procedural assets as acceptable only when each object is represented by a stable local object protokit and placed through layered/raycast-aware generation.
- Use local/public screenshots as regular proof and video as targeted motion proof.

## Non-Completion Truth

The goal is not complete. Current work has strong scaffolding and proof harnesses, but the final end state still requires approved promoted legacy assets, higher-fidelity character/animation, deeper combat, more physical world interaction, and stronger human-view extraction gameplay.
