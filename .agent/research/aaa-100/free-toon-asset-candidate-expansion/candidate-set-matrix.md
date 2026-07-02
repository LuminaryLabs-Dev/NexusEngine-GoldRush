# Candidate Set Matrix

Status: active docs-only

## Purpose

Track free toon asset candidate sets as production bundles. Each bundle exists to solve a visible gameplay problem, not to collect files.

## Matrix

| Set | Player-facing problem | Candidate bundle | Domain owner | Needed proof | State |
| --- | --- | --- | --- | --- | --- |
| Desert rocks and plants | terrain reads empty, flat, and low scale | rocks, boulders, cactus, scrub, talus | world / render / physics | raycast placement plus scale screenshots | planned |
| Rail and train | loading-yard sequence needs a believable vehicle and track path | locomotive, wagons, straight/curve track, station props | scene / world / transition | boarding sequence screenshot and motion proof | planned |
| Prospector character | current rig is too prototype-like for AAA feel | rigged humanoid, hats, tools, animation set | character / control / animation | lobby spin and over-shoulder movement proof | planned |
| Frontier town and camp | POIs lack readable western identity | cabins, tents, crates, barrels, campfire, signs, fencing | content / world / combat | town shelf and camp route screenshots | planned |
| Mining cargo tools | mining/carry/cashout lacks tactile object identity | pickaxe, shovel, cart, ore pile, gold, satchel, chest | gameplay / content / interaction | mine -> carry -> cashout human proof | planned |
| Combat cover and weapon cues | ambush pressure lacks readable cover language | barricades, carts, rocks, crates, revolver/rifle silhouettes | combat / content / camera | cover route, threat line, and combat receipt proof | planned |
| Audio SFX and music | current semantic cues need better sound sources | impact, UI, train, mining, cashout, combat, ambience | audio / presentation / gameplay | cue-state playback proof and fallback parity | planned |
| Sky atmosphere material | terrain and horizon need a coherent toon mood | sky gradients, clouds, terrain swatches, HDRI reference | render / world / art | first-viewport horizon and mobile proof | planned |

## Domain Fit

```txt
source candidate
|-- source evidence
|-- license evidence
|-- family id
|-- candidate id
|-- style target
|-- target kit
|-- placement role
|-- interaction role
|-- proof gate
`-- blocked reason until approved
```

## Alignment Check

Have I checked whether this expansion still aligns with the prior goals, and do I need to trim or reframe anything before outputting it?

Answer: yes. This expansion stays aligned because it is candidate-only, kit-owned, toon-shaded, western, terrain-aware, and blocked from runtime promotion until the existing gates are satisfied.

