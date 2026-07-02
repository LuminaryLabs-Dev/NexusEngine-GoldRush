# LOD Mesh Plan

Status: active docs-only
Domain: world / render / performance

## Goal

Build toward a massive desert terrain mesh that can be streamed or swapped by LOD without losing grounding, route readability, or visual composition.

## LOD Rings

| Ring | Player meaning | Geometry | Collider | Objects |
| --- | --- | --- | --- | --- |
| Near | Footing, interaction, cover, mining | dense chunks | exact height samples and blockers | full interactive protokits |
| Mid | Route, sightlines, landmarks | medium chunks | coarse blocker checks only | important silhouettes and gameplay cues |
| Far | Horizon, mood, battle-royale scale | low chunks or impostors | none unless needed for blockers | silhouette-only props |

## Chunk Rules

- Every chunk carries `sourceRevision`.
- Every chunk carries `lodLevel`.
- Every chunk exposes bounds, edge sample ids, and seam neighbors.
- Near chunks can use denser triangles and normal detail.
- Mid chunks preserve route contours and landmark silhouette.
- Far chunks preserve mesa/ridge horizon and sky blend.
- Skirts or shared edges are allowed, but cracks are not.
- LOD swaps must be validated while the player moves, not only from a static camera.

## Why One Giant Runtime Mesh Is Not Enough

A single giant mesh can provide authoring truth, but it is not enough as the runtime representation. The browser game needs:

- loadable chunks
- cullable bounds
- lower-cost far terrain
- isolated validation fixtures
- stable collider parity
- future multiplayer performance budget control

## Proof Targets

| Proof | Requirement |
| --- | --- |
| Source fixture proof | Same source produces render, collider, masks, and routes. |
| Seam proof | Adjacent chunks show no gaps from near to far. |
| LOD movement proof | Walking and mouse-look do not show obvious popping at normal speed. |
| Collider parity proof | Player does not float or sink when crossing chunk boundaries. |
| Public proof | Pages build uses same source revision as local proof. |

## Stop Conditions

Stop the implementation if the first LOD pass only improves a screenshot angle. LOD work must preserve natural walking, terrain raycasts, route guidance, and extraction/combat placement.

