# First Map Slice Simulation

Status: active docs-only
Domain: simulation / world / gameplay

## Simulated Slice

```txt
fixture: goldrush.desert.fixture.001
area: small canyon basin
features:
  - wash floor route
  - one low ridge blocker
  - one mine shelf
  - one rail/depot strip
  - one gold seam
  - one cashout anchor
  - one cover lane
  - near and mid LOD chunks
```

## Expected Implementation Feel

1. Load fixture metadata and revision.
2. Validate bounds, sample grid, masks, chunks, anchors, and proof samples.
3. Generate one render chunk from fixture height/material data.
4. Generate collider/raycast samples from the same height data.
5. Place one mine object and one extraction object using anchors.
6. Spawn player on valid walkable terrain.
7. Walk from spawn to mine through route mask.
8. Mine a source-backed gold target.
9. Walk to cashout through extraction route.
10. Record result with fixture revision in proof state.

## Failure Modes To Simulate

| Failure | Expected stop |
| --- | --- |
| render chunk uses different height than collider | block renderer replacement |
| mine anchor is on blocker mask | reject anchor |
| extraction anchor has no route | reject zone |
| chunk edge height differs | fail seam proof |
| public build has older fixture revision | fail deploy proof |
| proof teleports player to target | fail human-view acceptance |

## Success Definition

The first slice succeeds only when a human-view proof can show natural walking over source-backed terrain to a source-backed mine and source-backed cashout without debug placement.

