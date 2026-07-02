# Staging Report Sanitization Research

Status: active docs-only

Atom ID: 009-06
Parent packet: 009 - Staging And Bot Proof Gap

## Research Question

What evidence, game reference, or engine surface is needed before GoldRush can implement: Make staging reports sanitized and explicit about simulated versus live behavior.

## Reference Basis

- Apex Legends official page: https://www.ea.com/games/apex-legends/apex-legends
- PUBG Blue Zone revamp dev letter: https://pubg.com/en-asia/news/10280
- Hunt: Showdown official game page: https://www.huntshowdown.com/game
- GitHub game engines collection: https://github.com/collections/game-engines

## Interpretation For GoldRush

A 60-player target needs staging proof when live players are not available; bot behavior must exercise the game loop rather than stand still.

## Evidence To Gather Later

- current repo kit owner and public API surface
- existing validator or closest proof harness
- human-view screenshot or video requirement if player-facing
- public deploy proof requirement if the claim affects Pages
- sanitization requirement for any retained report

## Resolution Boundary

This research note is resolved only when the matching atom has a kit-owned contract, proof path, edge-case audit, and no conflict with the active docs-only boundary.
