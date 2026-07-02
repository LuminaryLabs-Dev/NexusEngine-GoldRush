# 07 Interest Management Regions

Status: planned

## Purpose

Limit replicated state by region, sightline, party, threat, and objective relevance.

## Player Need

The game should feel alive without flooding each client with all 60 players at full fidelity.

## Owning Kits

- Generic incubator candidate: `n:network:interest-management`
- GoldRush custom kit: `n:goldrush:interest-management-regions`

## Public API Seed

- `getInterestSet(peerId)`
- `updateInterestRegion(peerId, position)`
- `explainInterest(peerId)`

## Internal API Seed

- `scoreEntityRelevance(peer, entity)`
- `bucketRegion(position)`
- `applyPriorityBudget(peer)`

## Events

- `interest.region.changed`
- `interest.entity.added`
- `interest.entity.removed`

## Snapshot

- `peerId`
- `regionId`
- `entityCount`
- `priorityBudget`
- `hiddenEntityCount`

## Validator

`validate-interest-management-regions.mjs`

## Player-View Proof

A 60-entity simulated match keeps per-peer replicated entities within budget while preserving nearby threats/objectives.

## Risk If Missing

Without interest management, 60-player replication will either flood clients or hide important combat context.
