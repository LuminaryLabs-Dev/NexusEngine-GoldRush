# GoldRush Kit Contract - Desert World Map

Status: active docs-only

1. domainPath: n:goldrush:desert-world-map.
2. purpose: Compose the authored terrain source into a wild-west extraction battle royale map with routes, towns, mines, rails, gold seams, extraction sites, cover lanes, and final-rush convergence.
3. publicApi: loadMap(mapId), getSpawn(seed,partyState), getGoldZones(), getExtractionSites(), getRouteGuides(playerState), getCombatLanes(), getMapSnapshot().
4. internalApi: region resolver, landmark selection, route weighting, gold density sampling, extraction risk scoring, cover lane projection, prop anchor expansion, final-rush convergence selection.
5. events: desertMapLoaded, regionActivated, goldZoneResolved, extractionSiteResolved, coverLaneResolved, mapProofFailed.
6. snapshot: active map id, terrain revision, regions, landmarks, spawn rings, route graph, gold zones, extraction sites, cover lanes, prop anchors, proof status.
7. reset: clear map-specific regions, dynamic route hints, temporary proof receipts, and match-scoped placement results while preserving static source records.
8. dataExposed: gameplay-ready descriptors derived from the generic terrain source; no raw source paths, no unapproved assets, no renderer-only state.
9. validator: future validator must prove every gameplay zone is on walkable terrain, reachable through route masks, visible enough for player-view proof, and stable across restart.
10. graduationRule: not promotable as-is because it is GoldRush-specific; only subcontracts with no game rules may later graduate.
