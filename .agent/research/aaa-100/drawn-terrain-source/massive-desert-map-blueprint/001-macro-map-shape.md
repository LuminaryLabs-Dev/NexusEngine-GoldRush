# Macro Map Shape

Status: active docs-only
Domain: world / art direction / traversal

## Purpose

Define the large terrain shape that future source fixtures should build toward.

## Shape

```txt
goldrush.desert.map.v1
|-- outer horizon ring
|   |-- non-playable far mesas
|   |-- sky/terrain blend line
|   `-- HLOD silhouette proxies
|-- playable basin
|   |-- wash lowlands
|   |-- town shelf
|   |-- mine shelf
|   |-- rail shelf
|   `-- extraction shelf
|-- central obstacle
|   |-- mountain blocker
|   |-- ridge split paths
|   |-- cover pockets
|   `-- sightline breaks
`-- route web
    |-- safe long loops
    |-- risky gold shortcuts
    |-- train approach
    |-- cashout routes
    `-- final pressure corridors
```

## Player-Readable Intent

| Region | Player read | Gameplay job |
| --- | --- | --- |
| Outer mesas | The world keeps going. | Horizon scale and LOD target. |
| Basin floor | This is the claim field. | Main traversal and mining space. |
| Washes | Natural travel lanes. | Low-cover routes, gold seams, bot paths. |
| Central mountain | Go around, not through. | Macro blocker and rotation decision. |
| Mine shelf | Valuable but exposed. | Mining start and ambush pressure. |
| Town shelf | Shelter and clutter. | Cover, staging, optional route. |
| Rail shelf | Arrival and extraction identity. | Train, depot, cashout setpieces. |

## Failure If Skipped

The map will remain an enlarged test surface. Players will see props and terrain pieces, but not a coherent place.

