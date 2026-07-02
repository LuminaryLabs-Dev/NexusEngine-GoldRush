# Continuous Audit Wave 002

Status: active docs-only
Date: 2026-07-01

## Purpose

Run a battle-royale and extraction reference parity audit after the authored terrain kit spec. This wave checks whether GoldRush is solving the product, pacing, staging, art, audio, and deploy gaps that common battle royale and extraction games imply.

## Current Diagnosis

Wave 001 covered cross-domain technical drift. Wave 002 covers reference-driven design drift: the game should not become only a terrain demo, only a kit demo, or only a proof harness. It needs a playable 60-player wild-west extraction product shape with authored map identity, squad staging, pressure pacing, extraction stakes, world-readable audio, toon content, and versioned public proof.

## Reference Sources

- Apex Legends official page: https://www.ea.com/games/apex-legends/apex-legends
- PUBG Blue Zone revamp dev letter: https://pubg.com/en-asia/news/10280
- Hunt: Showdown official game page: https://www.huntshowdown.com/game
- GitHub game engines collection: https://github.com/collections/game-engines

## Packet Index

See `audit-wave-matrix.md` for the 12 active reference parity packets.

## Atomic Layer

- `atomic/README.md`
- `atomic/atomic-matrix.md`
- `atomic/research-matrix.md`
- 72 atomic audit packets.
- 72 paired research packets.

## Use Rule

Before implementing a roadmap row, check wave 001 for technical drift and wave 002 for product/reference drift. A row is not resolved if it passes a local technical check but still fails the relevant player-facing reference parity packet.

When a wave 002 packet applies, read its matching atomic packets and research notes before coding. The parent packet names the gap; the atom names the implementation-sized proof requirement.
