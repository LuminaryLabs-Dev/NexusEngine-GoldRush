# Bot Roster Contract

Status: active docs-only

## Purpose

Define the minimum data needed for bots to support single-player staging without becoming fake invisible pressure.

## Contract

A staged bot must expose:

- bot id.
- squad id.
- archetype.
- spawn zone.
- current intent.
- perception state.
- target state.
- combat readability state.
- extraction or cargo objective when relevant.
- receipt identity.

## Archetypes

| Archetype | Purpose | Readable behavior |
| --- | --- | --- |
| prospector | Competes for gold. | Moves toward resource and cashout routes. |
| ambusher | Pressures carried cargo. | Telegraphs before attacking. |
| guard | Defends mine, town, or extraction site. | Holds cover and reacts to intrusion. |
| runner | Tries to cash out quickly. | Carries visible cargo and seeks extraction. |
| scout | Reveals movement and pressure. | Moves on ridges or routes and signals threat. |
| decoy | Creates noise and misdirection. | Produces readable false pressure without hidden damage. |

