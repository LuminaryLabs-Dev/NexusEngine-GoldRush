# Massive Desert Map Blueprint Atomic Matrix

Status: active docs-only

## Purpose

Track the atomic implementation packets for the massive desert map blueprint.

## Matrix

| Atom | Packet | Domain | Generic kit | GoldRush kit | State |
| --- | --- | --- | --- | --- | --- |
| 01-01-macro-basin-silhouette-intent | [Macro Basin Silhouette - Intent](atomic/01-01-macro-basin-silhouette-intent.md) | world / art direction | `n:world:authored-terrain-mesh` | `n:goldrush:desert-world-map` | planned |
| 01-02-macro-basin-silhouette-data | [Macro Basin Silhouette - Data Fixture](atomic/01-02-macro-basin-silhouette-data.md) | world / art direction | `n:world:authored-terrain-mesh` | `n:goldrush:desert-world-map` | planned |
| 01-03-macro-basin-silhouette-consumer | [Macro Basin Silhouette - Consumer Contract](atomic/01-03-macro-basin-silhouette-consumer.md) | world / art direction | `n:world:authored-terrain-mesh` | `n:goldrush:desert-world-map` | planned |
| 01-04-macro-basin-silhouette-proof | [Macro Basin Silhouette - Proof Gate](atomic/01-04-macro-basin-silhouette-proof.md) | world / art direction | `n:world:authored-terrain-mesh` | `n:goldrush:desert-world-map` | planned |
| 02-01-horizon-mesa-hlod-intent | [Horizon Mesa HLOD - Intent](atomic/02-01-horizon-mesa-hlod-intent.md) | render / performance / world | `n:world:terrain-chunks` | `n:goldrush:gold-field-lod` | planned |
| 02-02-horizon-mesa-hlod-data | [Horizon Mesa HLOD - Data Fixture](atomic/02-02-horizon-mesa-hlod-data.md) | render / performance / world | `n:world:terrain-chunks` | `n:goldrush:gold-field-lod` | planned |
| 02-03-horizon-mesa-hlod-consumer | [Horizon Mesa HLOD - Consumer Contract](atomic/02-03-horizon-mesa-hlod-consumer.md) | render / performance / world | `n:world:terrain-chunks` | `n:goldrush:gold-field-lod` | planned |
| 02-04-horizon-mesa-hlod-proof | [Horizon Mesa HLOD - Proof Gate](atomic/02-04-horizon-mesa-hlod-proof.md) | render / performance / world | `n:world:terrain-chunks` | `n:goldrush:gold-field-lod` | planned |
| 03-01-central-mountain-blocker-intent | [Central Mountain Blocker - Intent](atomic/03-01-central-mountain-blocker-intent.md) | world / physics / route design | `n:physics:collider` | `n:goldrush:terrain-physics` | planned |
| 03-02-central-mountain-blocker-data | [Central Mountain Blocker - Data Fixture](atomic/03-02-central-mountain-blocker-data.md) | world / physics / route design | `n:physics:collider` | `n:goldrush:terrain-physics` | planned |
| 03-03-central-mountain-blocker-consumer | [Central Mountain Blocker - Consumer Contract](atomic/03-03-central-mountain-blocker-consumer.md) | world / physics / route design | `n:physics:collider` | `n:goldrush:terrain-physics` | planned |
| 03-04-central-mountain-blocker-proof | [Central Mountain Blocker - Proof Gate](atomic/03-04-central-mountain-blocker-proof.md) | world / physics / route design | `n:physics:collider` | `n:goldrush:terrain-physics` | planned |
| 04-01-wash-route-network-intent | [Wash Route Network - Intent](atomic/04-01-wash-route-network-intent.md) | world / control / staging | `n:world:route-graph` | `n:goldrush:player-route-guidance` | planned |
| 04-02-wash-route-network-data | [Wash Route Network - Data Fixture](atomic/04-02-wash-route-network-data.md) | world / control / staging | `n:world:route-graph` | `n:goldrush:player-route-guidance` | planned |
| 04-03-wash-route-network-consumer | [Wash Route Network - Consumer Contract](atomic/04-03-wash-route-network-consumer.md) | world / control / staging | `n:world:route-graph` | `n:goldrush:player-route-guidance` | planned |
| 04-04-wash-route-network-proof | [Wash Route Network - Proof Gate](atomic/04-04-wash-route-network-proof.md) | world / control / staging | `n:world:route-graph` | `n:goldrush:player-route-guidance` | planned |
| 05-01-rail-train-corridor-intent | [Rail Train Corridor - Intent](atomic/05-01-rail-train-corridor-intent.md) | scene / world / extraction | `n:scene:transition` | `n:goldrush:train-loading` | planned |
| 05-02-rail-train-corridor-data | [Rail Train Corridor - Data Fixture](atomic/05-02-rail-train-corridor-data.md) | scene / world / extraction | `n:scene:transition` | `n:goldrush:train-loading` | planned |
| 05-03-rail-train-corridor-consumer | [Rail Train Corridor - Consumer Contract](atomic/05-03-rail-train-corridor-consumer.md) | scene / world / extraction | `n:scene:transition` | `n:goldrush:train-loading` | planned |
| 05-04-rail-train-corridor-proof | [Rail Train Corridor - Proof Gate](atomic/05-04-rail-train-corridor-proof.md) | scene / world / extraction | `n:scene:transition` | `n:goldrush:train-loading` | planned |
| 06-01-town-shelf-poi-intent | [Town Shelf POI - Intent](atomic/06-01-town-shelf-poi-intent.md) | world / content / combat | `n:world:zone-mask` | `n:goldrush:frontier-town-protokits` | planned |
| 06-02-town-shelf-poi-data | [Town Shelf POI - Data Fixture](atomic/06-02-town-shelf-poi-data.md) | world / content / combat | `n:world:zone-mask` | `n:goldrush:frontier-town-protokits` | planned |
| 06-03-town-shelf-poi-consumer | [Town Shelf POI - Consumer Contract](atomic/06-03-town-shelf-poi-consumer.md) | world / content / combat | `n:world:zone-mask` | `n:goldrush:frontier-town-protokits` | planned |
| 06-04-town-shelf-poi-proof | [Town Shelf POI - Proof Gate](atomic/06-04-town-shelf-poi-proof.md) | world / content / combat | `n:world:zone-mask` | `n:goldrush:frontier-town-protokits` | planned |
| 07-01-mine-gold-seam-poi-intent | [Mine Gold Seam POI - Intent](atomic/07-01-mine-gold-seam-poi-intent.md) | gameplay / content / world | `n:world:placement-raycast` | `n:goldrush:gold-seam-protokits` | planned |
| 07-02-mine-gold-seam-poi-data | [Mine Gold Seam POI - Data Fixture](atomic/07-02-mine-gold-seam-poi-data.md) | gameplay / content / world | `n:world:placement-raycast` | `n:goldrush:gold-seam-protokits` | planned |
| 07-03-mine-gold-seam-poi-consumer | [Mine Gold Seam POI - Consumer Contract](atomic/07-03-mine-gold-seam-poi-consumer.md) | gameplay / content / world | `n:world:placement-raycast` | `n:goldrush:gold-seam-protokits` | planned |
| 07-04-mine-gold-seam-poi-proof | [Mine Gold Seam POI - Proof Gate](atomic/07-04-mine-gold-seam-poi-proof.md) | gameplay / content / world | `n:world:placement-raycast` | `n:goldrush:gold-seam-protokits` | planned |
| 08-01-extraction-depot-cashout-intent | [Extraction Depot Cashout - Intent](atomic/08-01-extraction-depot-cashout-intent.md) | gameplay / world / presentation | `n:world:zone-mask` | `n:goldrush:cashout-sites` | planned |
| 08-02-extraction-depot-cashout-data | [Extraction Depot Cashout - Data Fixture](atomic/08-02-extraction-depot-cashout-data.md) | gameplay / world / presentation | `n:world:zone-mask` | `n:goldrush:cashout-sites` | planned |
| 08-03-extraction-depot-cashout-consumer | [Extraction Depot Cashout - Consumer Contract](atomic/08-03-extraction-depot-cashout-consumer.md) | gameplay / world / presentation | `n:world:zone-mask` | `n:goldrush:cashout-sites` | planned |
| 08-04-extraction-depot-cashout-proof | [Extraction Depot Cashout - Proof Gate](atomic/08-04-extraction-depot-cashout-proof.md) | gameplay / world / presentation | `n:world:zone-mask` | `n:goldrush:cashout-sites` | planned |
| 09-01-cover-combat-sightlines-intent | [Cover Combat Sightlines - Intent](atomic/09-01-cover-combat-sightlines-intent.md) | combat / world / camera | `n:world:line-of-sight` | `n:goldrush:combat-route-guidance` | planned |
| 09-02-cover-combat-sightlines-data | [Cover Combat Sightlines - Data Fixture](atomic/09-02-cover-combat-sightlines-data.md) | combat / world / camera | `n:world:line-of-sight` | `n:goldrush:combat-route-guidance` | planned |
| 09-03-cover-combat-sightlines-consumer | [Cover Combat Sightlines - Consumer Contract](atomic/09-03-cover-combat-sightlines-consumer.md) | combat / world / camera | `n:world:line-of-sight` | `n:goldrush:combat-route-guidance` | planned |
| 09-04-cover-combat-sightlines-proof | [Cover Combat Sightlines - Proof Gate](atomic/09-04-cover-combat-sightlines-proof.md) | combat / world / camera | `n:world:line-of-sight` | `n:goldrush:combat-route-guidance` | planned |
| 10-01-zone-pressure-final-rush-intent | [Zone Pressure Final Rush - Intent](atomic/10-01-zone-pressure-final-rush-intent.md) | battle royale / gameplay / world | `n:world:zone-mask` | `n:goldrush:final-rush-pressure` | planned |
| 10-02-zone-pressure-final-rush-data | [Zone Pressure Final Rush - Data Fixture](atomic/10-02-zone-pressure-final-rush-data.md) | battle royale / gameplay / world | `n:world:zone-mask` | `n:goldrush:final-rush-pressure` | planned |
| 10-03-zone-pressure-final-rush-consumer | [Zone Pressure Final Rush - Consumer Contract](atomic/10-03-zone-pressure-final-rush-consumer.md) | battle royale / gameplay / world | `n:world:zone-mask` | `n:goldrush:final-rush-pressure` | planned |
| 10-04-zone-pressure-final-rush-proof | [Zone Pressure Final Rush - Proof Gate](atomic/10-04-zone-pressure-final-rush-proof.md) | battle royale / gameplay / world | `n:world:zone-mask` | `n:goldrush:final-rush-pressure` | planned |
| 11-01-lod-cell-budget-intent | [LOD Cell Budget - Intent](atomic/11-01-lod-cell-budget-intent.md) | performance / render / network | `n:world:terrain-chunks` | `n:goldrush:gold-field-lod` | planned |
| 11-02-lod-cell-budget-data | [LOD Cell Budget - Data Fixture](atomic/11-02-lod-cell-budget-data.md) | performance / render / network | `n:world:terrain-chunks` | `n:goldrush:gold-field-lod` | planned |
| 11-03-lod-cell-budget-consumer | [LOD Cell Budget - Consumer Contract](atomic/11-03-lod-cell-budget-consumer.md) | performance / render / network | `n:world:terrain-chunks` | `n:goldrush:gold-field-lod` | planned |
| 11-04-lod-cell-budget-proof | [LOD Cell Budget - Proof Gate](atomic/11-04-lod-cell-budget-proof.md) | performance / render / network | `n:world:terrain-chunks` | `n:goldrush:gold-field-lod` | planned |
| 12-01-source-proof-restart-intent | [Source Proof Restart - Intent](atomic/12-01-source-proof-restart-intent.md) | validation / production / release | `n:runtime:validation` | `n:goldrush:reality-status` | planned |
| 12-02-source-proof-restart-data | [Source Proof Restart - Data Fixture](atomic/12-02-source-proof-restart-data.md) | validation / production / release | `n:runtime:validation` | `n:goldrush:reality-status` | planned |
| 12-03-source-proof-restart-consumer | [Source Proof Restart - Consumer Contract](atomic/12-03-source-proof-restart-consumer.md) | validation / production / release | `n:runtime:validation` | `n:goldrush:reality-status` | planned |
| 12-04-source-proof-restart-proof | [Source Proof Restart - Proof Gate](atomic/12-04-source-proof-restart-proof.md) | validation / production / release | `n:runtime:validation` | `n:goldrush:reality-status` | planned |
