# 05 Mining Cargo Tools Source Set

Status: active docs-only

## Purpose

Make the extraction loop tactile: players should see what they mine, what they carry, and where they cash out.

## Candidate Sources

| Source | Candidate role | Current evidence |
| --- | --- | --- |
| Quaternius Fantasy Props / Survival / RPG packs | pickaxe-like tools, crates, chests, gold/resource silhouettes | catalog lists pickaxe, crate, chest, gold, tools, survival equipment |
| Kenney | impact sounds, UI audio, simple 3D and 2D resource vocabulary | asset pages and support identify CC0 asset policy |
| KayKit Resource Bits / Block Bits | toon resource chunks, crates, gems, tools | KayKit pages describe resource and blocky game asset sets |

## Target Kit

`n:goldrush:mining-cargo-protokits`

## Data Exposed

- resource object id.
- tool object id.
- carried object id.
- hold interaction role.
- pickup/carry visual state.
- deposit target role.
- cue audio target.
- receipt mapping.

## First Proof

```txt
gold seam visual
-> pickaxe/tool visual
-> carried nugget or satchel visual
-> cashout container visual
-> mine hold proof
-> carry proof
-> deposit proof
```

## Rejection Rule

Reject candidates that do not make the action more readable from the player camera.

