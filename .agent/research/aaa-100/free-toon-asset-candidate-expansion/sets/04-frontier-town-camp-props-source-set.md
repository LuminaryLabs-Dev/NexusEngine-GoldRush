# 04 Frontier Town And Camp Props Source Set

Status: active docs-only

## Purpose

Make town shelves, mine camps, cashout depots, and route landmarks read as frontier spaces instead of isolated markers.

## Candidate Sources

| Source | Candidate role | Current evidence |
| --- | --- | --- |
| Quaternius Medieval Village / Buildings / Fantasy Props | cabins, props, wagons, crates, blacksmith-like set pieces | catalog lists village, buildings, wagon, crate, market, and props |
| Kenney | lightweight modular props and UI-adjacent icons | support page states asset pages are CC0 |
| KayKit Complete / Resource Bits / Block Bits | stylized props, resources, crates, toon material language | KayKit pages list CC0-style packs and engine-compatible formats |

## Target Kit

`n:goldrush:frontier-setpiece-protokits`

## Data Exposed

- setpiece id.
- POI role.
- route role.
- cover role.
- interaction role.
- terrain shelf anchor.
- sightline class.
- occlusion risk.

## First Proof

Place one town shelf cluster:

```txt
two building candidates
-> three prop candidates
-> town protokit descriptors
-> terrain shelf anchors
-> combat sightline check
-> local/public screenshot proof
```

## Rejection Rule

Reject town props that look medieval/fantasy without western adaptation, block player movement unpredictably, or create unreadable cover.

