# Map Zones And POIs

Status: active docs-only
Domain: world / gameplay / content

## Purpose

Define the minimum POI set for the first high-fidelity desert source revision.

## POI Web

| POI | Terrain need | Gameplay need | Asset families |
| --- | --- | --- | --- |
| Rail Approach | long shelf, gentle curve, visible horizon | train arrival, train departure, party handoff | rail, depot, train props, smoke, signs |
| Frontier Town | flat shelf with side alleys | cover, staging, optional loot/tools | buildings, crates, barrels, signs, water tower |
| Mine Mouth | ridge cut into hillside | mining entry, gold seam, ambush risk | mine beams, cart rail, lanterns, ore piles |
| Wash Lowlands | dry stream cuts through basin | travel lane, route guidance, gold flakes | scrub, rocks, tailings, cracked ground |
| Central Mesa | high blocker with ring paths | rotation choice, line-of-sight break | cliff faces, boulders, talus |
| Prospector Camp | small safe-ish waypoint | teaching and recovery | tents, bedrolls, campfire, tools |
| Cashout Depot | readable extraction landmark | deposit, contest, results receipts | arch, bell, flag, rail spur, safe box |
| High-Risk Gold Shelf | visible rich seam near cover | high value conflict | gold seam, cover rocks, warning signage |

## Zone Masks

```txt
zoneMasks
|-- spawn.safe
|-- train.path
|-- town.cover
|-- mine.gold
|-- wash.route
|-- mesa.blocker
|-- shelf.highValue
|-- extraction.cashout
|-- finalRush.pressure
`-- bot.staging
```

## Acceptance

Each POI must have:

- terrain footprint
- source mask
- route entry
- object anchor set
- gameplay purpose
- screenshot angle
- local/public proof label

