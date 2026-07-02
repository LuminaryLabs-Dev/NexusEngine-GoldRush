# Kit Gap Register

Status: active

| Gap | Generic kit candidate | GoldRush kit candidate | Priority |
| --- | --- | --- | --- |
| Bot Role Taxonomy | `n:ai:role-taxonomy` | `n:goldrush:bot-role-taxonomy` | high |
| Bot Roster Scale Fixture | `n:ai:bot-roster` | `n:goldrush:staging-bot-roster` | high |
| Bot Spawn And Party Fill | `n:ai:spawn-fill` | `n:goldrush:bot-party-fill` | high |
| Bot Route Intent | `n:ai:route-intent` | `n:goldrush:bot-route-intent` | high |
| Bot Terrain Movement | `n:ai:movement-agent` | `n:goldrush:bot-terrain-movement` | high |
| Bot Resource Prospecting | `n:ai:objective-agent` | `n:goldrush:bot-prospecting` | high |
| Bot Mining And Cargo | `n:ai:objective-agent` | `n:goldrush:bot-cargo-runner` | high |
| Bot Cashout Objective | `n:ai:objective-agent` | `n:goldrush:bot-cashout-runner` | high |
| Bot Threat Telegraph | `n:ai:combat-agent` | `n:goldrush:bot-threat-telegraph` | high |
| Bot Cover And Peek | `n:ai:combat-agent` | `n:goldrush:bot-cover-counterplay` | high |
| Bot Weapon Engagement | `n:ai:combat-agent` | `n:goldrush:bot-western-combat` | high |
| Bot Downed Revive Recovery | `n:ai:recovery-agent` | `n:goldrush:bot-recovery` | high |
| Encounter Director Pacing | `n:ai:encounter-director` | `n:goldrush:encounter-director` | high |
| Encounter Distance Bands | `n:ai:encounter-director` | `n:goldrush:encounter-distance-bands` | high |
| Survivor Density Snapshot | `n:ai:density-snapshot` | `n:goldrush:survivor-density` | high |
| Bot Difficulty Personas | `n:ai:difficulty-persona` | `n:goldrush:bot-difficulty-personas` | high |
| Simulation Reporting | `n:runtime:simulation-proof` | `n:goldrush:bot-simulation-reporting` | high |
| Local Public Bot Proof Boundary | `n:runtime:simulation-proof` | `n:goldrush:bot-proof-boundary` | high |

## Implementation Implication

When coding resumes, the first shippable slice should not create all systems at once. Build role taxonomy, roster fixture, terrain movement, one prospecting behavior, one threat telegraph, and proof labels first. That is enough to test whether the bot layer is useful before broad combat or economy work.
