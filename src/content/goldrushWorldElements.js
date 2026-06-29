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
    buildings: ["station", "water-tower", "freight-shed", "ticket-office"],
    pathIds: ["path.station-to-west-basin", "path.station-to-east-rail"],
    roomWindowIds: ["room-window-west-basin"],
  },
  {
    id: "town.coyote-junction",
    label: "Coyote Junction",
    role: "mid-map-settlement-and-cover",
    position: { x: 1180, z: 380 },
    footprint: { width: 520, depth: 340 },
    buildings: ["saloon", "assay-office", "sheriff-post", "stable", "general-store"],
    pathIds: ["path.station-to-east-rail", "path.east-rail-to-cashout"],
    roomWindowIds: ["room-window-east-rail"],
  },
  {
    id: "town.sundered-camp",
    label: "Sundered Camp",
    role: "combat-town-and-gold-risk-zone",
    position: { x: -120, z: 920 },
    footprint: { width: 360, depth: 240 },
    buildings: ["collapsed-cabin", "ore-bin", "mine-office"],
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

export function createGoldRushWorldElements({ rooms = { shards: [] }, phase = "lobby" } = {}) {
  const shardIds = rooms.shards?.map((shard) => shard.id) ?? [];
  const activeRoomWindows = roomPatchWindows.filter((window) => shardIds.length === 0 || shardIds.includes(window.shardId));
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
  if (!world.loadingGates.some((gate) => gate.transitionId === "goldrush.transition.roomHandoffStart")) {
    failures.push("missing-loading-handoff-gate");
  }
  return {
    passed: failures.length === 0,
    failures,
  };
}
