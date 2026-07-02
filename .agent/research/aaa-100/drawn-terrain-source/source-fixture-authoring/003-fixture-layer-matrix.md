# Fixture Layer Matrix

Status: active docs-only
Domain: world / content / gameplay
Future kit: `n:goldrush:desert-world-map`

## Matrix

| Layer | Required in fixture | Consumer | Proof target |
| --- | --- | --- | --- |
| Bounds and scale | yes | camera, movement, network partitions | map does not feel toy-sized |
| Height | yes | render, physics, route, placement | player never floats or sinks |
| Normal | derived or stored | render, movement, placement | slopes and lighting agree |
| Slope | derived or stored | movement, placement, extraction | anchors reject bad ground |
| Walkable mask | yes | player, bots, spawn, cashout | natural walking path exists |
| Blocker mask | yes | physics, camera, combat | mountains cannot be crossed accidentally |
| Material mask | yes | terrain bands, toon shader | desert is not one flat color |
| Biome mask | yes | prop families, ambience | assets match terrain regions |
| Route mask | yes | guidance, bots, proof | player can read where to go |
| Rail mask | yes | train, depot, rails | train/rail geometry is grounded |
| Mine mask | yes | mining, props, audio | gold source reads as place |
| Gold mask | yes | mining objects, economy | mine targets are authored |
| Cover mask | yes | combat, threat staging | combat has physical readable cover |
| Extraction mask | yes | cashout, final rush | extraction is reachable and visible |
| Chunk LOD | yes | renderer, public proof | no seams or popping from first slice |
| Proof samples | yes | validators, Playwright | local/public can compare state |

## Acceptance

The fixture can be ugly and small, but every required layer must have at least one valid sample and one invalid sample. A validator that only proves happy paths is not enough.

