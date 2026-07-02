# Implementation Readiness Audit

Status: active docs-only

## Not Ready If

- The fixture cannot name one source revision id.
- Renderer, collider, placement, and gameplay masks do not read the same source.
- LOD chunks have no seam policy.
- Object families are still positioned only by renderer-local constants.
- Player route proof still depends on direct placement helpers.
- The first map slice cannot show spawn, mine, route, cashout, blocker, and horizon.

## Ready When

- A tiny fixture can serialize and reset.
- Height, normal, slope, and mask samples are deterministic.
- Near chunk visual triangles and collider samples match within a defined tolerance.
- At least three object families place by source anchors or downward raycast.
- A natural player route can walk from spawn to mine to cashout.
- Local and public proof reports name the same source revision.
