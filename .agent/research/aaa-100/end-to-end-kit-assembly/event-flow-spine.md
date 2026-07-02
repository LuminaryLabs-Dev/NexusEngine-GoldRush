# Event Flow Spine

Status: active docs-only

## Purpose

List the primary event spine that should connect the end-to-end loop without direct hidden calls between unrelated systems.

## Spine

1. `runtime.kit.registry.changed` -> `runtimeDomainRegistry` owned by `n:goldrush:runtime`
2. `scene.site.activated` -> `sceneSiteLoader` owned by `n:goldrush:scene-flow`
3. `title.entry.started` -> `titleAudioEntry` owned by `n:goldrush:music-and-stingers`
4. `party.lobby.member.changed` -> `partyLobbyCharacterPreview` owned by `n:goldrush:party-lobby plus n:goldrush:prospector-preview`
5. `match.config.changed` -> `groupSelectionMatchConfig` owned by `n:goldrush:party-lobby`
6. `train.sequence.beat.changed` -> `trainLoadingSequence` owned by `n:goldrush:train-loading`
7. `party.boarding.ready.changed` -> `trainBoardingPartySync` owned by `n:goldrush:party-boarding-sync`
8. `world.map.revision.loaded` -> `goldFieldSpawnMapSource` owned by `n:goldrush:desert-world-map`
9. `controller.frame.resolved` -> `thirdPersonController` owned by `n:goldrush:exploration-camera plus n:goldrush:prospector-movement`
10. `physics.grounding.sampled` -> `terrainGroundingPhysics` owned by `n:goldrush:terrain-physics plus n:goldrush:player-grounding`
11. `resource.affordance.discovered` -> `resourceDiscoveryProtokits` owned by `n:goldrush:desert-prop-kits plus n:goldrush:gold-seam-protokits`
12. `mining.hold.completed` -> `miningHoldAction` owned by `n:goldrush:mine-hold-action`
13. `cargo.carried.changed` -> `cargoCarryRisk` owned by `n:goldrush:gold-carrying`
14. `threat.pressure.changed` -> `threatAmbushPressure` owned by `n:goldrush:ambush-pressure`
15. `combat.route.target.changed` -> `coverCombatRoute` owned by `n:goldrush:combat-route-guidance plus n:goldrush:cover-protokits`
16. `extraction.hold.completed` -> `cashoutExtractionSites` owned by `n:goldrush:cashout-sites`
17. `match.results.finalized` -> `scoringResultsReplay` owned by `n:goldrush:extraction-receipts plus n:goldrush:gold-rush-scoring plus n:goldrush:results-screen`
18. `staging.bot.roster.changed` -> `botFillStaging` owned by `n:goldrush:bot-fill-staging`
19. `network.room.scale.sampled` -> `sixtyPlayerRoomScale` owned by `n:goldrush:room-orchestration`
20. `release.proof.published` -> `deployProofRestart` owned by `n:goldrush:reality-status`

## Event Rule

Each event is a fact. It should describe what changed, not command every downstream system directly. Downstream kits may subscribe and produce their own domain events.

