# Digital Asset Family Plan

Status: active docs-only
Domain: content / world / render

## Purpose

Clarify that the drawn terrain source must be paired with digital asset families. The terrain is the base asset, but AAA readability needs recognizable authored content families that attach to terrain masks and placement anchors.

## Asset Families

| Family | Map layer | Needed forms | Kit direction |
| --- | --- | --- | --- |
| Mesa and ridge walls | blocker / horizon / biome | cliff bands, caps, shelves, shadow cuts | `n:goldrush:desert-ridge-protokits` |
| Wash floor | wash / route | dry creek bed, smoother path, sediment color | `n:goldrush:wash-route-protokits` |
| Mine | mine / gold / rail | tunnel mouth, support beams, tailings, cart, lanterns | `n:goldrush:mine-site-protokits` |
| Town | town / route / cover | false fronts, porches, fences, barrels, signs | `n:goldrush:frontier-town-protokits` |
| Rail | rail / extraction / train | track bed, rails, ties, depot, signal, cart | `n:goldrush:railway-protokits` |
| Gold seam | gold / interaction | seam, ore lode, nugget cluster, claim marker | `n:goldrush:gold-seam-protokits` |
| Extraction | extraction / risk | depot beacon, cashout post, smoke, bell, platform | `n:goldrush:cashout-setpiece-protokits` |
| Cover | cover / combat | rocks, wagons, crates, low walls, ridge notches | `n:goldrush:cover-protokits` |
| Vegetation | biome / route | cactus, scrub, brush clumps, dead branches | `n:goldrush:desert-plant-protokits` |
| Small rocks | material / clutter | pebbles, boulders, talus, trail stones | `n:goldrush:desert-rock-protokits` |

## Placement Rule

Each asset family should consume terrain data:

```txt
terrain source mask
-> placement anchor
-> downward raycast
-> slope/walkability check
-> protokit descriptor
-> renderer batch
-> interaction/collider hook if needed
```

## Why This Matters

The current procedural scene can produce many objects, but many objects do not equal authored composition. Digital asset families must explain the map:

- where players travel
- what is valuable
- where danger can come from
- where extraction is possible
- what terrain can block or guide movement
- what the horizon and landmarks mean

## Stop Conditions

Do not call an asset family resolved if it only creates a primitive shape. A resolved family needs source mask ownership, placement proof, visual form, interaction role if relevant, and human-view readability.

