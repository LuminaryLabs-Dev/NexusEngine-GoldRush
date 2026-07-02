# Topology Decision Contract

Status: active

## Purpose

Define which topology a run uses before any match begins.

## Allowed Topologies

| Topology | Allowed claim | Blocked claim |
| --- | --- | --- |
| local-solo | local gameplay proof | multiplayer proof |
| local-tabs | same-browser peer proof | separate machine proof |
| local-contexts | same-machine peer proof | public network proof |
| public-peer-party | public party transport proof | live 60-player proof |
| simulator-20 | 20 simulated actor proof | live 20-player proof |
| simulator-60 | 60 simulated actor proof | live 60-player proof |
| future-live-private | real peer match proof | only after real peers join |

## Required Data

- mode id.
- topology id.
- human count.
- bot count.
- peer count.
- machine count.
- proof tier.
- blocked claims.
