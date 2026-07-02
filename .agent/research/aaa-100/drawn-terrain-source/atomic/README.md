# Drawn Terrain Atomic Packets

Status: active docs-only

## Purpose

Break the drawn terrain source shift into implementation-sized atoms before any runtime work resumes. These packets make the source asset, LOD, collider, object placement, route, gameplay-zone, proof, and deployment concerns explicit.

## Counts

- Source families: 12
- Atoms per family: 4
- Atomic packets: 48
- Paired research notes: 48

## Matrix

| Atom | Packet | Domain | Generic kit | GoldRush kit | State |
| --- | --- | --- | --- | --- | --- |
| 01-01-source-governance-intent | [Source Governance - Intent](atomic/01-01-source-governance-intent.md) | governance/world | n:world:authored-terrain-mesh | n:goldrush:desert-world-map | planned |
| 01-02-source-governance-data | [Source Governance - Data Fixture](atomic/01-02-source-governance-data.md) | governance/world | n:world:authored-terrain-mesh | n:goldrush:desert-world-map | planned |
| 01-03-source-governance-consumer | [Source Governance - Consumer Contract](atomic/01-03-source-governance-consumer.md) | governance/world | n:world:authored-terrain-mesh | n:goldrush:desert-world-map | planned |
| 01-04-source-governance-proof | [Source Governance - Proof Gate](atomic/01-04-source-governance-proof.md) | governance/world | n:world:authored-terrain-mesh | n:goldrush:desert-world-map | planned |
| 02-01-coordinate-scale-intent | [Coordinate And Scale - Intent](atomic/02-01-coordinate-scale-intent.md) | world | n:world:authored-terrain-mesh | n:goldrush:desert-world-map | planned |
| 02-02-coordinate-scale-data | [Coordinate And Scale - Data Fixture](atomic/02-02-coordinate-scale-data.md) | world | n:world:authored-terrain-mesh | n:goldrush:desert-world-map | planned |
| 02-03-coordinate-scale-consumer | [Coordinate And Scale - Consumer Contract](atomic/02-03-coordinate-scale-consumer.md) | world | n:world:authored-terrain-mesh | n:goldrush:desert-world-map | planned |
| 02-04-coordinate-scale-proof | [Coordinate And Scale - Proof Gate](atomic/02-04-coordinate-scale-proof.md) | world | n:world:authored-terrain-mesh | n:goldrush:desert-world-map | planned |
| 03-01-heightfield-form-intent | [Heightfield Form - Intent](atomic/03-01-heightfield-form-intent.md) | world/terrain | n:world:authored-terrain-mesh | n:goldrush:desert-world-map | planned |
| 03-02-heightfield-form-data | [Heightfield Form - Data Fixture](atomic/03-02-heightfield-form-data.md) | world/terrain | n:world:authored-terrain-mesh | n:goldrush:desert-world-map | planned |
| 03-03-heightfield-form-consumer | [Heightfield Form - Consumer Contract](atomic/03-03-heightfield-form-consumer.md) | world/terrain | n:world:authored-terrain-mesh | n:goldrush:desert-world-map | planned |
| 03-04-heightfield-form-proof | [Heightfield Form - Proof Gate](atomic/03-04-heightfield-form-proof.md) | world/terrain | n:world:authored-terrain-mesh | n:goldrush:desert-world-map | planned |
| 04-01-material-biome-masks-intent | [Material And Biome Masks - Intent](atomic/04-01-material-biome-masks-intent.md) | world/render/art | n:world:authored-terrain-mesh | n:goldrush:desert-world-map | planned |
| 04-02-material-biome-masks-data | [Material And Biome Masks - Data Fixture](atomic/04-02-material-biome-masks-data.md) | world/render/art | n:world:authored-terrain-mesh | n:goldrush:desert-world-map | planned |
| 04-03-material-biome-masks-consumer | [Material And Biome Masks - Consumer Contract](atomic/04-03-material-biome-masks-consumer.md) | world/render/art | n:world:authored-terrain-mesh | n:goldrush:desert-world-map | planned |
| 04-04-material-biome-masks-proof | [Material And Biome Masks - Proof Gate](atomic/04-04-material-biome-masks-proof.md) | world/render/art | n:world:authored-terrain-mesh | n:goldrush:desert-world-map | planned |
| 05-01-walkable-blocker-masks-intent | [Walkable And Blocker Masks - Intent](atomic/05-01-walkable-blocker-masks-intent.md) | world/physics/control | n:world:authored-terrain-mesh | n:goldrush:terrain-physics | planned |
| 05-02-walkable-blocker-masks-data | [Walkable And Blocker Masks - Data Fixture](atomic/05-02-walkable-blocker-masks-data.md) | world/physics/control | n:world:authored-terrain-mesh | n:goldrush:terrain-physics | planned |
| 05-03-walkable-blocker-masks-consumer | [Walkable And Blocker Masks - Consumer Contract](atomic/05-03-walkable-blocker-masks-consumer.md) | world/physics/control | n:world:authored-terrain-mesh | n:goldrush:terrain-physics | planned |
| 05-04-walkable-blocker-masks-proof | [Walkable And Blocker Masks - Proof Gate](atomic/05-04-walkable-blocker-masks-proof.md) | world/physics/control | n:world:authored-terrain-mesh | n:goldrush:terrain-physics | planned |
| 06-01-lod-chunk-topology-intent | [LOD Chunk Topology - Intent](atomic/06-01-lod-chunk-topology-intent.md) | world/render/performance | n:world:authored-terrain-mesh | n:goldrush:gold-field-renderer | planned |
| 06-02-lod-chunk-topology-data | [LOD Chunk Topology - Data Fixture](atomic/06-02-lod-chunk-topology-data.md) | world/render/performance | n:world:authored-terrain-mesh | n:goldrush:gold-field-renderer | planned |
| 06-03-lod-chunk-topology-consumer | [LOD Chunk Topology - Consumer Contract](atomic/06-03-lod-chunk-topology-consumer.md) | world/render/performance | n:world:authored-terrain-mesh | n:goldrush:gold-field-renderer | planned |
| 06-04-lod-chunk-topology-proof | [LOD Chunk Topology - Proof Gate](atomic/06-04-lod-chunk-topology-proof.md) | world/render/performance | n:world:authored-terrain-mesh | n:goldrush:gold-field-renderer | planned |
| 07-01-collider-parity-intent | [Collider Parity - Intent](atomic/07-01-collider-parity-intent.md) | physics | n:physics:collider | n:goldrush:terrain-physics | planned |
| 07-02-collider-parity-data | [Collider Parity - Data Fixture](atomic/07-02-collider-parity-data.md) | physics | n:physics:collider | n:goldrush:terrain-physics | planned |
| 07-03-collider-parity-consumer | [Collider Parity - Consumer Contract](atomic/07-03-collider-parity-consumer.md) | physics | n:physics:collider | n:goldrush:terrain-physics | planned |
| 07-04-collider-parity-proof | [Collider Parity - Proof Gate](atomic/07-04-collider-parity-proof.md) | physics | n:physics:collider | n:goldrush:terrain-physics | planned |
| 08-01-placement-anchors-intent | [Placement Anchors - Intent](atomic/08-01-placement-anchors-intent.md) | world/content | n:world:placement-raycast | n:goldrush:desert-prop-kits | planned |
| 08-02-placement-anchors-data | [Placement Anchors - Data Fixture](atomic/08-02-placement-anchors-data.md) | world/content | n:world:placement-raycast | n:goldrush:desert-prop-kits | planned |
| 08-03-placement-anchors-consumer | [Placement Anchors - Consumer Contract](atomic/08-03-placement-anchors-consumer.md) | world/content | n:world:placement-raycast | n:goldrush:desert-prop-kits | planned |
| 08-04-placement-anchors-proof | [Placement Anchors - Proof Gate](atomic/08-04-placement-anchors-proof.md) | world/content | n:world:placement-raycast | n:goldrush:desert-prop-kits | planned |
| 09-01-route-rail-wash-network-intent | [Route Rail And Wash Network - Intent](atomic/09-01-route-rail-wash-network-intent.md) | world/control/gameplay | n:world:route-graph | n:goldrush:player-route-guidance | planned |
| 09-02-route-rail-wash-network-data | [Route Rail And Wash Network - Data Fixture](atomic/09-02-route-rail-wash-network-data.md) | world/control/gameplay | n:world:route-graph | n:goldrush:player-route-guidance | planned |
| 09-03-route-rail-wash-network-consumer | [Route Rail And Wash Network - Consumer Contract](atomic/09-03-route-rail-wash-network-consumer.md) | world/control/gameplay | n:world:route-graph | n:goldrush:player-route-guidance | planned |
| 09-04-route-rail-wash-network-proof | [Route Rail And Wash Network - Proof Gate](atomic/09-04-route-rail-wash-network-proof.md) | world/control/gameplay | n:world:route-graph | n:goldrush:player-route-guidance | planned |
| 10-01-gameplay-zone-masks-intent | [Gameplay Zone Masks - Intent](atomic/10-01-gameplay-zone-masks-intent.md) | gameplay/world | n:world:zone-mask | n:goldrush:gold-and-extraction-zones | planned |
| 10-02-gameplay-zone-masks-data | [Gameplay Zone Masks - Data Fixture](atomic/10-02-gameplay-zone-masks-data.md) | gameplay/world | n:world:zone-mask | n:goldrush:gold-and-extraction-zones | planned |
| 10-03-gameplay-zone-masks-consumer | [Gameplay Zone Masks - Consumer Contract](atomic/10-03-gameplay-zone-masks-consumer.md) | gameplay/world | n:world:zone-mask | n:goldrush:gold-and-extraction-zones | planned |
| 10-04-gameplay-zone-masks-proof | [Gameplay Zone Masks - Proof Gate](atomic/10-04-gameplay-zone-masks-proof.md) | gameplay/world | n:world:zone-mask | n:goldrush:gold-and-extraction-zones | planned |
| 11-01-asset-family-anchors-intent | [Asset Family Anchors - Intent](atomic/11-01-asset-family-anchors-intent.md) | content/render/world | n:render:micro-object-instancing | n:goldrush:desert-asset-family-protokits | planned |
| 11-02-asset-family-anchors-data | [Asset Family Anchors - Data Fixture](atomic/11-02-asset-family-anchors-data.md) | content/render/world | n:render:micro-object-instancing | n:goldrush:desert-asset-family-protokits | planned |
| 11-03-asset-family-anchors-consumer | [Asset Family Anchors - Consumer Contract](atomic/11-03-asset-family-anchors-consumer.md) | content/render/world | n:render:micro-object-instancing | n:goldrush:desert-asset-family-protokits | planned |
| 11-04-asset-family-anchors-proof | [Asset Family Anchors - Proof Gate](atomic/11-04-asset-family-anchors-proof.md) | content/render/world | n:render:micro-object-instancing | n:goldrush:desert-asset-family-protokits | planned |
| 12-01-proof-deploy-restart-intent | [Proof Deploy And Restart - Intent](atomic/12-01-proof-deploy-restart-intent.md) | validation/release | n:runtime:validation | n:goldrush:reality-status | planned |
| 12-02-proof-deploy-restart-data | [Proof Deploy And Restart - Data Fixture](atomic/12-02-proof-deploy-restart-data.md) | validation/release | n:runtime:validation | n:goldrush:reality-status | planned |
| 12-03-proof-deploy-restart-consumer | [Proof Deploy And Restart - Consumer Contract](atomic/12-03-proof-deploy-restart-consumer.md) | validation/release | n:runtime:validation | n:goldrush:reality-status | planned |
| 12-04-proof-deploy-restart-proof | [Proof Deploy And Restart - Proof Gate](atomic/12-04-proof-deploy-restart-proof.md) | validation/release | n:runtime:validation | n:goldrush:reality-status | planned |

## Rule

Do not implement these atoms by editing the live renderer first. Start from source fixtures, validators, and consumer contracts.
