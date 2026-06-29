export const goldRushWorldScale = {
  id: "goldrush.world.massiveDesert",
  widthMeters: 5200,
  depthMeters: 3400,
  patchMeters: 128,
  visualScale: 0.01,
  maxPlayers: 100,
  roomSize: 50,
};

const roomPatchWindows = [
  {
    id: "room-window-west-basin",
    shardId: "shard-1",
    label: "West Basin",
    originPatch: { x: -14, z: -3 },
    patchRadius: 5,
    entryPathId: "path.station-to-west-basin",
    exitPathId: "path.west-basin-to-cashout",
    landmarkIds: ["town.dustfall-station", "tower.ridge-watch"],
    goldZoneIds: ["gold.zone.west-drywash", "gold.zone.ridge-pocket"],
  },
  {
    id: "room-window-east-rail",
    shardId: "shard-2",
    label: "East Rail",
    originPatch: { x: 12, z: 4 },
    patchRadius: 5,
    entryPathId: "path.station-to-east-rail",
    exitPathId: "path.east-rail-to-cashout",
    landmarkIds: ["town.coyote-junction", "tower.water-pump"],
    goldZoneIds: ["gold.zone.east-rail-cut", "gold.zone.ghost-town-cache"],
  },
];

const mountainRanges = [
  {
    id: "mountain.north-mesa-wall",
    label: "North Mesa Wall",
    role: "horizon-blocker",
    position: { x: -900, z: -1320 },
    footprint: { width: 2100, depth: 420 },
    height: 460,
    roomWindowIds: ["room-window-west-basin", "room-window-east-rail"],
  },
  {
    id: "mountain.west-red-ridge",
    label: "West Red Ridge",
    role: "terrain-boundary",
    position: { x: -1980, z: 280 },
    footprint: { width: 520, depth: 1700 },
    height: 360,
    roomWindowIds: ["room-window-west-basin"],
  },
  {
    id: "mountain.east-tailings-cliff",
    label: "East Tailings Cliff",
    role: "combat-backdrop",
    position: { x: 1840, z: 620 },
    footprint: { width: 620, depth: 1200 },
    height: 280,
    roomWindowIds: ["room-window-east-rail"],
  },
];

const towns = [
  {
    id: "town.dustfall-station",
    label: "Dustfall Station",
    role: "lobby-town-and-train-entry",
    position: { x: -1480, z: -460 },
    footprint: { width: 420, depth: 260 },
    buildings: ["station", "water-tower", "freight-shed", "ticket-office", "rail-platform", "boarding-house"],
    pathIds: ["path.station-to-west-basin", "path.station-to-east-rail"],
    roomWindowIds: ["room-window-west-basin"],
  },
  {
    id: "town.coyote-junction",
    label: "Coyote Junction",
    role: "mid-map-settlement-and-cover",
    position: { x: 1180, z: 380 },
    footprint: { width: 520, depth: 340 },
    buildings: ["saloon", "assay-office", "sheriff-post", "stable", "general-store", "blacksmith"],
    pathIds: ["path.station-to-east-rail", "path.east-rail-to-cashout"],
    roomWindowIds: ["room-window-east-rail"],
  },
  {
    id: "town.sundered-camp",
    label: "Sundered Camp",
    role: "combat-town-and-gold-risk-zone",
    position: { x: -120, z: 920 },
    footprint: { width: 360, depth: 240 },
    buildings: ["collapsed-cabin", "ore-bin", "mine-office", "supply-shack", "watch-post", "cookhouse"],
    pathIds: ["path.west-basin-to-cashout", "path.east-rail-to-cashout"],
    roomWindowIds: ["room-window-west-basin", "room-window-east-rail"],
  },
];

const landmarks = [
  {
    id: "tower.ridge-watch",
    label: "Ridge Watch Tower",
    role: "vertical-navigation-reference",
    position: { x: -820, z: -820 },
    height: 95,
    roomWindowIds: ["room-window-west-basin"],
  },
  {
    id: "tower.water-pump",
    label: "Water Pump Tower",
    role: "cashout-path-reference",
    position: { x: 1540, z: 760 },
    height: 72,
    roomWindowIds: ["room-window-east-rail"],
  },
  {
    id: "landmark.train-bridge",
    label: "Train Bridge",
    role: "room-handoff-and-loading-marker",
    position: { x: 80, z: -240 },
    height: 38,
    roomWindowIds: ["room-window-west-basin", "room-window-east-rail"],
  },
];

const goldZones = [
  {
    id: "gold.zone.west-drywash",
    label: "West Drywash",
    role: "starter-mining-zone",
    position: { x: -1360, z: 420 },
    radius: 210,
    richness: 0.58,
    roomWindowIds: ["room-window-west-basin"],
  },
  {
    id: "gold.zone.ridge-pocket",
    label: "Ridge Pocket",
    role: "high-risk-cliff-gold",
    position: { x: -620, z: -940 },
    radius: 160,
    richness: 0.82,
    roomWindowIds: ["room-window-west-basin"],
  },
  {
    id: "gold.zone.east-rail-cut",
    label: "East Rail Cut",
    role: "railside-mining-zone",
    position: { x: 1320, z: -120 },
    radius: 230,
    richness: 0.64,
    roomWindowIds: ["room-window-east-rail"],
  },
  {
    id: "gold.zone.ghost-town-cache",
    label: "Ghost Town Cache",
    role: "town-combat-gold-zone",
    position: { x: 980, z: 720 },
    radius: 140,
    richness: 0.9,
    roomWindowIds: ["room-window-east-rail"],
  },
];

const paths = [
  {
    id: "path.station-to-west-basin",
    label: "Station To West Basin",
    role: "drop-route",
    points: [
      { x: -1480, z: -460 },
      { x: -1280, z: -140 },
      { x: -1040, z: 180 },
      { x: -1360, z: 420 },
    ],
  },
  {
    id: "path.station-to-east-rail",
    label: "Station To East Rail",
    role: "drop-route",
    points: [
      { x: -1480, z: -460 },
      { x: -820, z: -380 },
      { x: 80, z: -240 },
      { x: 760, z: -160 },
      { x: 1320, z: -120 },
    ],
  },
  {
    id: "path.west-basin-to-cashout",
    label: "West Basin To Cashout",
    role: "cashout-route",
    points: [
      { x: -1360, z: 420 },
      { x: -760, z: 720 },
      { x: -120, z: 920 },
      { x: 260, z: 820 },
    ],
  },
  {
    id: "path.east-rail-to-cashout",
    label: "East Rail To Cashout",
    role: "cashout-route",
    points: [
      { x: 1320, z: -120 },
      { x: 1180, z: 380 },
      { x: 980, z: 720 },
      { x: 260, z: 820 },
    ],
  },
];

const scatterFields = [
  { id: "scatter.rocks.west-ridge", kind: "rocks", count: 46, anchor: { x: -1760, z: 260 }, spread: { x: 420, z: 920 } },
  { id: "scatter.cactus.central-wash", kind: "cactus", count: 38, anchor: { x: -160, z: 120 }, spread: { x: 1260, z: 620 } },
  { id: "scatter.fence.east-town", kind: "fence", count: 22, anchor: { x: 1180, z: 380 }, spread: { x: 560, z: 360 } },
  { id: "scatter.ore.sundered-camp", kind: "ore-props", count: 28, anchor: { x: -120, z: 920 }, spread: { x: 380, z: 260 } },
];

const loadingGates = [
  {
    id: "loading.gate.train-bridge",
    fromRoomWindowId: "room-window-west-basin",
    toRoomWindowId: "room-window-east-rail",
    triggerPathId: "path.station-to-east-rail",
    transitionId: "goldrush.transition.roomHandoffStart",
  },
  {
    id: "loading.gate.cashout-yard",
    fromRoomWindowId: "room-window-east-rail",
    toRoomWindowId: "room-window-west-basin",
    triggerPathId: "path.east-rail-to-cashout",
    transitionId: "goldrush.transition.roomHandoffComplete",
  },
];

const environmentSpaces = [
  {
    id: "space.world.canyon-basin",
    kind: "basin",
    role: "primary-playable-volume",
    footprint: { x: -1700, z: -980, width: 3400, depth: 1960 },
    spatialRule: "terrain form defines play space before props are placed",
  },
  {
    id: "space.world.wash-floor-trail",
    kind: "path-corridor",
    role: "movement-and-extraction-readability",
    footprint: { x: -1900, z: -720, width: 3800, depth: 1380 },
    spatialRule: "trail corridor stays clear enough to read at over-shoulder distance",
  },
  {
    id: "space.world.ridge-walls",
    kind: "canyon-wall-pair",
    role: "geologic-container",
    footprint: { x: -2500, z: -1500, width: 5000, depth: 3000 },
    spatialRule: "walls frame the basin and explain mine/gold placement",
  },
  {
    id: "space.world.mine-shelf",
    kind: "work-site",
    role: "resource-origin-and-landmark",
    footprint: { x: -1680, z: 260, width: 820, depth: 560 },
    spatialRule: "mine entrance, rail, cart, tailings, and gold seams belong to one shelf",
  },
  {
    id: "space.world.town-shelf",
    kind: "settlement",
    role: "human-scale-navigation-and-cover",
    footprint: { x: 780, z: 160, width: 920, depth: 620 },
    spatialRule: "town frontage forms a street and cover space, not random building scatter",
  },
  {
    id: "space.world.extraction-vista",
    kind: "route-vista",
    role: "cashout-pressure-direction",
    footprint: { x: -260, z: 560, width: 1280, depth: 620 },
    spatialRule: "the player should read the route out under final-rush pressure",
  },
];

export function createGoldRushWorldElements({ network = null, rooms = { shards: [] }, phase = "lobby" } = {}) {
  const partitionWindowIds = network?.partitions?.map((partition) => partition.roomWindowId) ?? [];
  const shardIds = rooms.shards?.map((shard) => shard.id) ?? network?.partitions?.map((partition) => partition.shardId) ?? [];
  const activeRoomWindows = roomPatchWindows.filter((window) => {
    if (partitionWindowIds.length > 0) return partitionWindowIds.includes(window.id);
    return shardIds.length === 0 || shardIds.includes(window.shardId);
  });
  return {
    version: "0.1.0",
    source: "goldrush-local-procedural-world-elements",
    phase,
    scale: goldRushWorldScale,
    roomPatchWindows,
    activeRoomWindows,
    mountainRanges,
    towns,
    landmarks,
    goldZones,
    paths,
    scatterFields,
    environmentSpaces,
    loadingGates,
  };
}

export function validateGoldRushWorldElements(world = createGoldRushWorldElements()) {
  const failures = [];
  if (world.scale.widthMeters < 5000 || world.scale.depthMeters < 3000) failures.push("world-scale-too-small");
  if (world.roomPatchWindows.length < 2) failures.push("missing-room-patch-windows");
  if (world.towns.length < 3) failures.push("missing-town-settlements");
  if (world.mountainRanges.length < 3) failures.push("missing-mountain-boundaries");
  if (world.goldZones.length < 4) failures.push("missing-gold-zones");
  if (world.paths.length < 4) failures.push("missing-route-network");
  if (world.environmentSpaces?.length < 6) failures.push("missing-environment-space-understanding");
  if (!world.environmentSpaces?.some((space) => space.id === "space.world.mine-shelf" && space.spatialRule.includes("one shelf"))) {
    failures.push("missing-mine-shelf-spatial-rule");
  }
  if (!world.loadingGates.some((gate) => gate.transitionId === "goldrush.transition.roomHandoffStart")) {
    failures.push("missing-loading-handoff-gate");
  }
  return {
    passed: failures.length === 0,
    failures,
  };
}

export function createTownLayoutDescriptors(world = createGoldRushWorldElements()) {
  return world.towns.map((town) => {
    const relatedPaths = world.paths.filter((path) => town.pathIds.includes(path.id));
    return {
      townId: town.id,
      label: town.label,
      role: town.role,
      patchWindowIds: town.roomWindowIds,
      anchor: { x: town.position.x, y: 0, z: town.position.z },
      footprint: town.footprint,
      streetGraph: createStreetGraphForTown(town, relatedPaths),
      buildings: town.buildings.map((building, index) => ({
        buildingId: `${town.id}.${building}-${index + 1}`,
        role: building,
        assetSlotId: `goldrush.town.${building}`,
        transform: createBuildingTransform(town, index),
        gameplayTags: buildingTags(building, town.role),
      })),
      transitionIds: town.pathIds.map((pathId) => `goldrush.transition.town.${town.id}.${pathId}`),
    };
  });
}

export function createPathNetworkDescriptors(world = createGoldRushWorldElements()) {
  return world.paths.map((path) => ({
    pathId: path.id,
    label: path.label,
    role: path.role,
    points: path.points.map((point, index) => ({
      id: `${path.id}.point-${index + 1}`,
      x: point.x,
      y: 0,
      z: point.z,
    })),
    tags: pathTags(path),
    connectedTownIds: world.towns.filter((town) => town.pathIds.includes(path.id)).map((town) => town.id),
    connectedGoldZoneIds: world.goldZones
      .filter((zone) => path.points.some((point) => distance2d(point, zone.position) <= zone.radius + 260))
      .map((zone) => zone.id),
  }));
}

export function createGoldZoneDescriptors(world = createGoldRushWorldElements()) {
  return world.goldZones.map((zone) => ({
    goldZoneId: zone.id,
    label: zone.label,
    role: zone.role,
    patchWindowIds: zone.roomWindowIds,
    center: { x: zone.position.x, y: 0, z: zone.position.z },
    radius: zone.radius,
    richness: zone.richness,
    spawnRateTicks: Math.max(20, Math.round(90 - zone.richness * 50)),
    nodeCapacity: Math.round(8 + zone.richness * 14),
    goldAmountPerPickup: 10,
    visualSlotId: "goldrush.prop.goldPile",
    audioCueId: "goldrush.audio.sfx.goldPickup",
    state: "spawning",
  }));
}

export function createAudioStateDescriptor({ phase = "lobby", combatActive = false, sceneState = null } = {}) {
  const boss = phase === "results" && combatActive;
  const audioState = boss ? "boss" : combatActive || phase === "combat" ? "combat" : "wandering";
  const musicCueId = audioState === "boss"
    ? "goldrush.audio.music.boss"
    : audioState === "combat"
      ? "goldrush.audio.music.combat"
      : "goldrush.audio.music.wandering";
  const oneShots = [];
  if (sceneState?.activeAudioCueId?.startsWith("goldrush.audio.sfx.")) {
    oneShots.push({
      cueId: sceneState.activeAudioCueId,
      slotId: sceneState.activeAudioCueId,
      dedupeId: sceneState.lastTransition?.id ?? sceneState.activeAudioCueId,
    });
  }
  return {
    audioState,
    musicCueId,
    crossfadeSeconds: audioState === "wandering" ? 5 : 1.6,
    oneShots,
  };
}

export function createAnimationStateDescriptor({
  playerId = "player-1",
  phase = "lobby",
  combatActive = false,
  carriedGold = 0,
  eliminated = false,
} = {}) {
  const speed = phase === "lobby" || phase === "extract" ? 0 : carriedGold > 120 ? 0.45 : 0.75;
  const isAiming = combatActive || phase === "combat";
  const isShooting = combatActive && carriedGold > 0;
  const baseState = eliminated ? "dead" : speed > 0 ? "run" : "idle";
  const aimState = !isAiming ? "none" : speed > 0 ? "aimRun" : "aimIdle";
  return {
    playerId,
    baseState,
    aimState,
    actionState: eliminated ? "none" : isShooting ? "shooting" : phase === "extract" ? "cashout" : "none",
    clipSlotIds: {
      base: `goldrush.anim.player.${baseState}`,
      aim: aimState === "none" ? null : `goldrush.anim.player.${aimState}`,
      action: isShooting ? "goldrush.anim.player.shooting" : null,
    },
    params: {
      speed,
      isAiming,
      isShooting,
      isRunning: speed > 0,
      isJumping: false,
      combatState: combatActive ? "InCombat" : "OutOfCombat",
    },
  };
}

function createStreetGraphForTown(town, relatedPaths) {
  const buildingNodes = town.buildings.map((building, index) => {
    const transform = createBuildingTransform(town, index);
    return {
      id: `${town.id}.street.${building}`,
      x: transform.x,
      y: 0,
      z: transform.z,
    };
  });
  const pathNodes = relatedPaths.map((path) => ({
    id: `${town.id}.street.${path.id}`,
    x: path.points[0].x,
    y: 0,
    z: path.points[0].z,
  }));
  const nodes = [
    { id: `${town.id}.street.center`, x: town.position.x, y: 0, z: town.position.z },
    ...buildingNodes,
    ...pathNodes,
  ];
  return {
    nodes,
    edges: nodes.slice(1).map((node) => ({
      from: `${town.id}.street.center`,
      to: node.id,
      tags: node.id.includes("path.") ? ["mainStreet", "routeConnection"] : ["mainStreet", "buildingFront"],
    })),
  };
}

function createBuildingTransform(town, index) {
  const column = index % 3;
  const row = Math.floor(index / 3);
  return {
    x: town.position.x + (column - 1) * 56,
    y: 0,
    z: town.position.z + (row - 0.5) * 44,
    rotationY: Number((index * 0.18).toFixed(3)),
    scale: 1,
  };
}

function buildingTags(building, townRole) {
  const tags = ["landmark", "cover"];
  if (building.includes("station") || building.includes("freight")) tags.push("spawnNearby", "rail");
  if (building.includes("saloon") || building.includes("assay")) tags.push("cashoutNearby", "townCenter");
  if (building.includes("ore") || building.includes("mine")) tags.push("goldNearby");
  if (townRole.includes("combat")) tags.push("combatCover");
  return tags;
}

function pathTags(path) {
  const tags = [path.role];
  if (path.role.includes("cashout")) tags.push("extraction");
  if (path.id.includes("rail")) tags.push("rail");
  if (path.id.includes("station")) tags.push("drop");
  return tags;
}

function distance2d(a, b) {
  return Math.hypot(a.x - b.x, a.z - b.z);
}
