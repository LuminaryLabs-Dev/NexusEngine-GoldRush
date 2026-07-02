# Source Artboard Audit Checklist

Status: active docs-only

## Checklist

| Area | Fake completion risk | Required hardening |
| --- | --- | --- |
| Source revision | Files exist but consumers do not report the revision id. | Every snapshot/proof names `sourceRevisionId`. |
| Scale | Terrain is multiplied larger but not authored larger. | Bounds, cell size, route time, and spawn density are documented. |
| Height | Mesh looks better but collider still samples old math. | Collider parity samples use source data. |
| Masks | Materials exist but gameplay ignores them. | Route, gold, cover, extraction, and pressure masks feed kits. |
| LOD | Far terrain is visible but seams/popping are not checked. | LOD proof includes movement across cell edges. |
| Assets | Imported/generated objects improve screenshots but are not kit-owned. | Every family has a protokit or candidate packet. |
| Gameplay | Receipts pass but player cannot read what to do. | Proof shots include route and interaction clarity. |
| Combat | Cover exists as props but not as fair tactical space. | Cover lane annotations feed combat route guidance. |
| Staging | Solo test passes and is described as multiplayer readiness. | Reports label solo, bot, simulated, and live modes separately. |
| Public deploy | Local screenshot looks good but public build is stale. | Public proof names same source revision. |

## Audit Result Rule

Do not move this packet toward resolved until the future implementation can answer every row with current file or proof evidence.
