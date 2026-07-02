# Gameplay Zone Contract

Status: active docs-only

## Purpose

Define how authored terrain produces gameplay zones for a 60-player wild-west extraction battle royale.

## Zone Types

| Zone | Purpose | Required terrain data | Required gameplay data |
| --- | --- | --- | --- |
| spawn ring | safe match entry | walkability, route mask, sightlines | party size, threat distance, train handoff |
| gold seam district | extraction value | gold density, biome, slope | mineable objects, cargo risk, noise pressure |
| town/mine camp | interaction hub | flatness, route, landmark | props, cover, loot/tool affordances |
| cover lane | combat counterplay | cover mask, normal/slope, sightline | threat routes, weapon range, escape route |
| extraction site | cashout risk | extraction mask, route, visibility | hold timer, contest pressure, final score receipts |
| final rush convergence | BR pacing | map center alternatives, route network | zone pressure, extraction conflict, remaining players |

## Public Snapshot

The GoldRush map kit should expose zones as serializable descriptors with stable ids, source revision, bounds, route hooks, risk tags, and proof status.

## Hard Rule

A gameplay zone is not valid if it is only a circle or marker. It must be grounded in authored terrain, visible to the player, reachable through route masks, and backed by gameplay rules.
