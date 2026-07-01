import { raycastTerrainDown, terrainFieldHeight } from "../physics/terrainCollider.js";

const FAMILY_BLUEPRINTS = [
  { family: "surface.sand-ripple", count: 360, geometryRole: "dust-ridge", materialRole: "sand", role: "terrain-dressing", zone: "open-field", placementRole: "noise", archetypes: ["wind-line", "wash-line", "boot-scuff"] },
  { family: "surface.gravel-chip", count: 140, geometryRole: "pebble", materialRole: "stone", role: "terrain-dressing", zone: "open-field", placementRole: "noise", archetypes: ["pebble-flat", "pebble-round", "pebble-slate"] },
  { family: "surface.red-rock-chip", count: 190, geometryRole: "pebble", materialRole: "red-rock", role: "terrain-dressing", zone: "canyon-rim", placementRole: "dressing", archetypes: ["red-chip", "oxide-splinter", "rim-chip"] },
  { family: "plant.dry-grass-blade", count: 420, geometryRole: "grass-blade", materialRole: "dry-grass", role: "terrain-dressing", zone: "trail-edge", archetypes: ["short-tuft", "long-tuft", "edge-line"] },
  { family: "plant.scrub-tuft", count: 180, geometryRole: "scrub", materialRole: "scrub", role: "terrain-dressing", zone: "trail-edge", archetypes: ["dead-root", "sage-scrub", "low-brush"] },
  { family: "plant.cactus-sprout", count: 90, geometryRole: "cactus-sprout", materialRole: "cactus", role: "landmark-dressing", zone: "vista-edge", archetypes: ["barrel-sprout", "saguaro-young", "dead-stump"] },
  { family: "mining.gold-fleck", count: 72, geometryRole: "gold-fleck", visualForm: "gold-nugget-cluster", materialRole: "gold", role: "reward-readability", zone: "gold-field", placementRole: "support", archetypes: ["nugget", "vein-chip", "pan-glint"] },
  { family: "mining.ore-chip", count: 90, geometryRole: "ore-chip", visualForm: "ore-lode-chip", materialRole: "ore", role: "reward-readability", zone: "mine-pad", placementRole: "support", archetypes: ["tailings", "ore-slate", "dark-seam"] },
  { family: "gold.seam-vein", count: 42, geometryRole: "gold-seam", visualForm: "gold-seam-lode", materialRole: "gold", role: "reward-readability", zone: "goldSeamZone", placementRole: "landmark", archetypes: ["embedded-vein", "rim-vein", "claim-seam"] },
  { family: "gold.tailings-line", count: 64, geometryRole: "tailings-pile", visualForm: "tailings-fan", materialRole: "ore", role: "reward-readability", zone: "goldSeamZone", placementRole: "support", archetypes: ["tailings-row", "pan-wash", "ore-spill"] },
  { family: "camp.wood-splinter", count: 150, geometryRole: "wood-splinter", materialRole: "wood", role: "settlement-detail", zone: "camp-pad", archetypes: ["board", "stake", "broken-timber"] },
  { family: "camp.canvas-scrap", count: 84, geometryRole: "canvas-scrap", materialRole: "canvas", role: "settlement-detail", zone: "camp-pad", archetypes: ["tent-flap", "bedroll-edge", "sack"] },
  { family: "trail.stone-marker", count: 110, geometryRole: "trail-marker", materialRole: "stone", role: "navigation", zone: "main-trail", archetypes: ["trail-rock", "claim-stack", "turn-marker"] },
  { family: "trail.foreground-rut", count: 72, geometryRole: "trail-rut", materialRole: "sand", role: "navigation", zone: "trailEdgeZone", placementRole: "support", archetypes: ["left-rut", "right-rut", "wagon-scuff"] },
  { family: "trail.edge-brush", count: 96, geometryRole: "grass-blade", materialRole: "dry-grass", role: "navigation", zone: "trailEdgeZone", placementRole: "dressing", archetypes: ["edge-tuft", "low-brush", "path-grass"] },
  { family: "canyon.strata-wedge", count: 160, geometryRole: "strata-wedge", materialRole: "red-rock", role: "terrain-depth", zone: "canyonWallZone", placementRole: "dressing", archetypes: ["strata-shelf", "rim-wedge", "erosion-lip"] },
  { family: "canyon.wall-segment", count: 42, geometryRole: "wall-segment", materialRole: "red-rock", role: "terrain-depth", zone: "canyonWallZone", placementRole: "landmark", archetypes: ["wall-left", "wall-right", "wall-turn"] },
  { family: "canyon.mesa-block", count: 18, geometryRole: "mesa-block", materialRole: "red-rock", role: "terrain-depth", zone: "canyonWallZone", placementRole: "landmark", archetypes: ["mesa-cap", "rim-mesa", "horizon-mesa"] },
  { family: "canyon.slope-skirt", count: 90, geometryRole: "slope-skirt", materialRole: "red-rock", role: "terrain-depth", zone: "canyonFloorZone", placementRole: "support", archetypes: ["base-fan", "talus-slope", "erosion-skirt"] },
  { family: "canyon.strata-ribbon", count: 96, geometryRole: "strata-ribbon", materialRole: "red-rock-dark", role: "terrain-depth", zone: "canyonWallZone", placementRole: "support", archetypes: ["thin-band", "diagonal-band", "shadow-band"] },
  { family: "canyon.shadow-pocket", count: 54, geometryRole: "shadow-pocket", materialRole: "red-rock-dark", role: "terrain-depth", zone: "canyonWallZone", placementRole: "support", archetypes: ["recess", "overhang", "crack"] },
  { family: "combat.cover-rock", count: 106, geometryRole: "cover-rock", materialRole: "red-rock-dark", role: "cover", zone: "combat-lane", archetypes: ["waist-cover", "ambush-rock", "ridge-cover"] },
  { family: "town.debris-nail", count: 96, geometryRole: "metal-sliver", materialRole: "metal", role: "settlement-detail", zone: "town-edge", archetypes: ["nail", "hinge", "plate"] },
  { family: "town.frontage-facade", count: 6, geometryRole: "town-frontage", materialRole: "wood", role: "settlement-detail", zone: "townFrontageZone", placementRole: "landmark", archetypes: ["claim-office", "assay-front", "stable-front"] },
  { family: "town.water-tower", count: 1, geometryRole: "water-tower", materialRole: "wood", role: "settlement-detail", zone: "townFrontageZone", placementRole: "landmark", archetypes: ["tank-tower"] },
  { family: "town.frontage-prop", count: 28, geometryRole: "frontage-prop", materialRole: "wood", role: "settlement-detail", zone: "townFrontageZone", placementRole: "support", archetypes: ["barrel-stack", "crate-row", "porch-post"] },
  { family: "rail.ballast-stone", count: 136, geometryRole: "ballast-stone", materialRole: "stone", role: "navigation", zone: "rail-bed", archetypes: ["ballast", "tie-stone", "rail-edge"] },
  { family: "mine.entrance-frame", count: 1, geometryRole: "mine-frame", materialRole: "wood", role: "settlement-detail", zone: "mineCampZone", placementRole: "landmark", archetypes: ["timber-frame"] },
  { family: "mine.support-timber", count: 12, geometryRole: "support-timber", materialRole: "wood", role: "settlement-detail", zone: "mineCampZone", placementRole: "support", archetypes: ["left-post", "right-post", "cross-beam"] },
  { family: "mine.ore-cart", count: 2, geometryRole: "ore-cart", materialRole: "metal", role: "settlement-detail", zone: "mineCampZone", placementRole: "landmark", archetypes: ["loaded-cart", "empty-cart"] },
  { family: "mine.tailings-pile", count: 18, geometryRole: "tailings-pile", visualForm: "tailings-fan", materialRole: "ore", role: "reward-readability", zone: "mineCampZone", placementRole: "support", archetypes: ["ore-spill", "tailings-mound", "dump-pile"] },
  { family: "mine.lantern-post", count: 4, geometryRole: "lantern-post", materialRole: "metal", role: "settlement-detail", zone: "mineCampZone", placementRole: "landmark", archetypes: ["entry-lantern", "trail-lantern"] },
  { family: "mine.warning-sign", count: 3, geometryRole: "warning-sign", materialRole: "wood", role: "settlement-detail", zone: "mineCampZone", placementRole: "support", archetypes: ["claim-sign", "danger-sign", "depth-sign"] },
  { family: "atmosphere.dust-card-anchor", count: 72, geometryRole: "dust-card-anchor", materialRole: "dust", role: "atmosphere", zone: "open-field", archetypes: ["dust-wisp", "heat-line", "trail-dust"] },
];

const MATERIAL_COLORS = {
  sand: 0xa98245,
  stone: 0x6e694d,
  "red-rock": 0xb45b32,
  "red-rock-dark": 0x71351f,
  "dry-grass": 0xb7a46a,
  scrub: 0x6d7f47,
  cactus: 0x4d7f4b,
  gold: 0xf4be45,
  ore: 0x7d5a38,
  wood: 0x7b4d31,
  canvas: 0xd6bd92,
  metal: 0x8d8b83,
  dust: 0xbf985d,
};

export function createGoldRushObjectMicroKits({ terrain, environmentSpace = null }) {
  const kits = [];
  for (const blueprint of FAMILY_BLUEPRINTS) {
    for (let index = 0; index < blueprint.count; index += 1) {
      const seed = hash(`${blueprint.family}.${index}`);
      const position = positionForSeed(seed, terrain, blueprint.family);
      const archetype = blueprint.archetypes[index % blueprint.archetypes.length];
      const raycastPlacement = resolveRaycastPlacement({ x: position.x, z: position.z, blueprint });
      const placement = createPlacementMetadata({ blueprint, seed, index, environmentSpace, raycastPlacement });
      const visual = createVisualMetadata({ blueprint, archetype, seed });
      const interaction = createInteractionMetadata({ blueprint, archetype });
      const protoKitId = `goldrush.micro.${blueprint.family}.${String(index + 1).padStart(4, "0")}`;
      const transform = {
        x: Number(position.x.toFixed(3)),
        y: Number(raycastPlacement.y.toFixed(3)),
        z: Number(position.z.toFixed(3)),
        yaw: Number((((seed % 6283) / 1000) % (Math.PI * 2)).toFixed(3)),
        pitch: Number((((seed >>> 9) % 11) / 100 - 0.05).toFixed(3)),
        roll: Number((((seed >>> 15) % 11) / 100 - 0.05).toFixed(3)),
        scale: Number((0.55 + ((seed >>> 8) % 90) / 100).toFixed(3)),
      };
      kits.push({
        id: protoKitId,
        individualObject: true,
        protoKit: createObjectProtoKitContract({ protoKitId, blueprint, interaction }),
        kit: `goldrush.micro.${blueprint.family}`,
        family: blueprint.family,
        archetype,
        role: blueprint.role,
        biome: "dry-canyon",
        generationLayers: createGenerationLayers({ blueprint, raycastPlacement, interaction }),
        placement,
        visual,
        interaction,
        transform,
        debug: {
          source: "procedural",
          pass: "layered-raycast-protokit-v1",
        },
        geometryRole: blueprint.geometryRole,
        visualForm: blueprint.visualForm ?? null,
        materialRole: blueprint.materialRole,
        gameplayTags: gameplayTagsForFamily(blueprint.family),
        position: {
          x: Number(position.x.toFixed(3)),
          y: Number(raycastPlacement.y.toFixed(3)),
          z: Number(position.z.toFixed(3)),
        },
        rotation: transform.yaw,
        scale: transform.scale,
        color: MATERIAL_COLORS[blueprint.materialRole],
        lod: visual.lod,
      });
    }
  }

  return {
    id: "goldrush.procObjects.microObjectKits",
    generatedBy: "goldrush-object-micro-kit-generator",
    requestedScale: "environment-space-first-object-kits",
    worldUnderstandingSource: environmentSpace?.id ?? "goldrush.worldUnderstanding.environmentSpace",
    count: kits.length,
    families: FAMILY_BLUEPRINTS.map((blueprint) => ({
      family: blueprint.family,
      count: blueprint.count,
      geometryRole: blueprint.geometryRole,
      visualForm: blueprint.visualForm ?? null,
      materialRole: blueprint.materialRole,
      domainScope: domainScopeForFamily(blueprint.family),
      generationLayers: ["seed", "environment-space", "raycast-placement", "visual-batch", "interaction-affordance"],
    })),
    kits,
  };
}

export function validateGoldRushObjectMicroKits(descriptor) {
  if (descriptor?.id !== "goldrush.procObjects.microObjectKits") return false;
  if (descriptor.count < 2500 || descriptor.kits?.length !== descriptor.count) return false;
  if (descriptor.families?.length < 12) return false;
  const ids = new Set(descriptor.kits.map((kit) => kit.id));
  if (ids.size !== descriptor.kits.length) return false;
  return descriptor.kits.every((kit) => (
    kit.individualObject === true
    && kit.id.startsWith("goldrush.micro.")
    && kit.protoKit?.kind === "goldrush-procedural-object-protokit"
    && kit.protoKit?.domainPath?.startsWith("n:goldrush:object:")
    && (kit.visual?.resourceForm == null || ["gold-nugget-cluster", "ore-lode-chip", "gold-seam-lode", "tailings-fan"].includes(kit.visual.resourceForm))
    && kit.generationLayers?.some((layer) => layer.id === "raycast-placement" && ["resolved", "fallback"].includes(layer.status))
    && kit.placement?.raycast?.mode === "downward-triangle-raycast"
    && kit.placement?.raycast?.source === "n:world:placement-raycast"
    && kit.interaction?.contract === "goldrush-micro-object-interaction-v1"
    && Number.isFinite(kit.position.x)
    && Number.isFinite(kit.position.y)
    && Number.isFinite(kit.position.z)
    && Number.isFinite(kit.rotation)
    && kit.scale > 0
    && Number.isFinite(kit.color)
    && kit.placement?.environmentSpaceId
  ));
}

export function selectNearestGoldRushObjectAffordance({
  descriptor,
  player,
  actionFilter = null,
  maxDistance = 3.2,
} = {}) {
  const playerPosition = player?.position ?? player ?? null;
  if (!descriptor?.kits?.length || !playerPosition) {
    return createAffordanceSelection({ selected: null, candidates: [], reason: "missing-input" });
  }
  const filters = Array.isArray(actionFilter)
    ? new Set(actionFilter)
    : actionFilter
      ? new Set([actionFilter])
      : null;
  const candidates = descriptor.kits
    .filter((kit) => kit.interaction?.enabled)
    .filter((kit) => !filters || filters.has(kit.interaction.action))
    .map((kit) => {
      const distance = distance2D(playerPosition, kit.position);
      const allowedDistance = Math.max(kit.interaction.radius, maxDistance);
      const inRange = distance <= allowedDistance;
      return {
        kitId: kit.id,
        protoKitId: kit.protoKit.id,
        domainPath: kit.protoKit.domainPath,
        family: kit.family,
        archetype: kit.archetype,
        action: kit.interaction.action,
        prompt: kit.interaction.prompt,
        priority: kit.interaction.priority,
        radius: kit.interaction.radius,
        allowedDistance,
        distance: Number(distance.toFixed(3)),
        inRange,
        target: createInteractionTarget(kit),
        position: structuredClone(kit.position),
        placement: structuredClone(kit.placement.raycast),
      };
    })
    .sort((a, b) => {
      const rangeScore = Number(b.inRange) - Number(a.inRange);
      const priorityScore = priorityRank(b.priority) - priorityRank(a.priority);
      return rangeScore || priorityScore || a.distance - b.distance || a.kitId.localeCompare(b.kitId);
    });
  const selected = candidates.find((candidate) => candidate.inRange) ?? null;
  return createAffordanceSelection({
    selected,
    candidates: candidates.slice(0, 8),
    reason: selected ? "selected" : "no-affordance-in-range",
  });
}

function positionForSeed(seed, terrain, family) {
  const spanX = terrain.bounds.maxX - terrain.bounds.minX;
  const spanZ = terrain.bounds.maxZ - terrain.bounds.minZ;
  let x = terrain.bounds.minX + ((seed % 10000) / 10000) * spanX;
  let z = terrain.bounds.minZ + ((((seed >>> 10) % 10000) / 10000) * spanZ);

  if (family.startsWith("trail.")) {
    const t = (seed % 10000) / 10000;
    x = terrain.bounds.minX + spanX * t;
    z = Math.sin(t * Math.PI * 2.4) * 5.2 + (t - 0.5) * terrain.depth * 0.42 + (((seed >>> 6) % 100) / 100 - 0.5) * 1.4;
  }

  if (family.startsWith("trail.foreground")) {
    const lane = ((seed >>> 4) % 100) / 100;
    x = -20 + lane * 31;
    z = -7.8 + Math.sin(lane * Math.PI * 1.4) * 2.1 + (((seed >>> 9) % 100) / 100 - 0.5) * 0.65;
  }

  if (family.startsWith("camp.") || family.startsWith("town.")) {
    x = 5.6 + (((seed >>> 5) % 100) / 100 - 0.5) * 8.5;
    z = 1.6 + (((seed >>> 13) % 100) / 100 - 0.5) * 5.5;
  }

  if (family.startsWith("town.frontage")) {
    const order = seed % 28;
    x = -0.5 + (order % 7) * 1.25;
    z = 8.2 + Math.floor(order / 7) * 0.55;
  }

  if (family.startsWith("town.water-tower")) {
    x = 9.6;
    z = 9.4;
  }

  if (family.startsWith("mining.") || family.startsWith("gold.")) {
    x = -17.5 + (((seed >>> 4) % 100) / 100 - 0.5) * 4.6;
    z = -16.5 + (((seed >>> 12) % 100) / 100 - 0.5) * 3.8;
  }

  if (family.startsWith("rail.")) {
    x = -7.2 + (((seed >>> 4) % 100) / 100 - 0.5) * 8.8;
    z = 5.3 + (((seed >>> 12) % 100) / 100 - 0.5) * 5.6;
  }

  if (family.startsWith("mine.")) {
    const anchor = mineAnchorForFamily(family, seed);
    x = anchor.x;
    z = anchor.z;
  }

  if (family.startsWith("canyon.")) {
    const side = seed % 2 === 0 ? -1 : 1;
    const t = (((seed >>> 11) % 10000) / 10000);
    const baseX = family.includes("slope-skirt") ? terrain.width * 0.39 : terrain.width * 0.47;
    x = side * (baseX + ((seed >>> 7) % 100) / 100 * terrain.width * 0.035);
    z = terrain.bounds.minZ + t * spanZ;
  }

  const column = Math.floor(((x - terrain.bounds.minX) / terrain.patchSize));
  const row = Math.floor(((z - terrain.bounds.minZ) / terrain.patchSize));
  const elevation = Math.sin(column * 0.9) * 0.18 + Math.cos(row * 0.65) * 0.14;
  return { x, z, elevation };
}

function createPlacementMetadata({ blueprint, seed, index, environmentSpace, raycastPlacement }) {
  const clusterId = `${blueprint.zone}.${String((seed >>> 4) % 18).padStart(2, "0")}`;
  const environmentSpaceId = environmentSpaceIdForZone(blueprint.zone);
  const space = environmentSpace?.spaces?.find((entry) => entry.id === environmentSpaceId) ?? null;
  const anchor = blueprint.zone === "main-trail"
    || blueprint.zone === "trailEdgeZone"
    ? "path-tangent"
    : blueprint.zone === "canyon-wall"
      || blueprint.zone === "canyonWallZone"
      || blueprint.zone === "canyonFloorZone"
      ? "slope-break"
      : blueprint.zone === "mine-pad" || blueprint.zone === "rail-bed"
        || blueprint.zone === "mineCampZone"
        ? "mine-spline"
        : blueprint.zone === "camp-pad" || blueprint.zone === "town-edge" || blueprint.zone === "townFrontageZone"
          ? "settlement-pad"
          : "terrain-seed";
  return {
    zone: blueprint.zone,
    zoneId: blueprint.zone,
    environmentSpaceId,
    environmentKind: space?.kind ?? "inferred-space",
    spatialReason: space?.role ?? "placed-from-world-understanding",
    clusterId,
    anchor,
    placementRole: blueprint.placementRole ?? "dressing",
    isolatedSingleton: (blueprint.placementRole ?? "dressing") === "landmark" && blueprint.count <= 4,
    densityClass: blueprint.count > 300 ? "high" : blueprint.count > 120 ? "medium" : "low",
    avoidTags: avoidTagsForZone(blueprint.zone),
    raycast: raycastPlacement.raycast,
    sequence: index,
  };
}

function resolveRaycastPlacement({ x, z, blueprint }) {
  const hit = raycastTerrainDown({ x, z });
  const surfaceY = Number(hit?.point?.y ?? terrainFieldHeight(x, z));
  const yOffset = placementYOffsetForBlueprint(blueprint);
  return {
    y: surfaceY + yOffset,
    raycast: {
      mode: "downward-triangle-raycast",
      source: "n:world:placement-raycast",
      contract: "goldrush-layered-procedural-placement-v1",
      resolved: Boolean(hit?.point),
      bandId: hit?.bandId ?? null,
      hitKind: hit?.kind ?? "raycast-miss-height-fallback",
      surfaceY: Number(surfaceY.toFixed(3)),
      yOffset,
      normal: {
        x: Number((hit?.normal?.x ?? 0).toFixed(4)),
        y: Number((hit?.normal?.y ?? 1).toFixed(4)),
        z: Number((hit?.normal?.z ?? 0).toFixed(4)),
      },
    },
  };
}

function placementYOffsetForBlueprint(blueprint) {
  if (blueprint.geometryRole.includes("grass") || blueprint.geometryRole.includes("dust")) return 0.035;
  if (blueprint.geometryRole.includes("gold") || blueprint.geometryRole.includes("ore") || blueprint.geometryRole.includes("pebble")) return 0.055;
  if (blueprint.placementRole === "landmark") return 0.02;
  return 0.075;
}

function createObjectProtoKitContract({ protoKitId, blueprint, interaction }) {
  return {
    id: protoKitId,
    kind: "goldrush-procedural-object-protokit",
    domainPath: `n:goldrush:object:${blueprint.family}`,
    genericDomains: [
      "n:world:placement-raycast",
      "n:render:micro-object-instancing",
    ],
    publicApi: ["snapshot", "placeByRaycast", "composeVisual", "interactionHint"],
    internalApi: ["resolveSeed", "resolveEnvironmentSpace", "resolveBatchKey", "resolveInteraction"],
    events: ["object.placed", "object.visualReady", interaction.enabled ? "object.interactionReady" : "object.passiveReady"],
    snapshot: ["id", "family", "transform", "raycast", "visual", "interaction"],
    reset: "regenerate-from-seed-and-raycast",
    promotionStatus: "local-goldrush-custom-protokit",
    domainScope: domainScopeForFamily(blueprint.family),
  };
}

function createGenerationLayers({ blueprint, raycastPlacement, interaction }) {
  return [
    { id: "seed", status: "resolved", owner: "n:runtime:snapshot" },
    { id: "environment-space", status: "resolved", owner: "n:goldrush:environment-space", zone: blueprint.zone },
    { id: "raycast-placement", status: raycastPlacement.raycast.resolved ? "resolved" : "fallback", owner: "n:world:placement-raycast", bandId: raycastPlacement.raycast.bandId },
    { id: "visual-batch", status: "resolved", owner: "n:render:micro-object-instancing", geometryRole: blueprint.geometryRole, materialRole: blueprint.materialRole },
    { id: "interaction-affordance", status: interaction.enabled ? "resolved" : "passive", owner: "n:gameplay:interaction-hold", action: interaction.action },
  ];
}

function createInteractionMetadata({ blueprint, archetype }) {
  const base = {
    contract: "goldrush-micro-object-interaction-v1",
    enabled: false,
    action: "none",
    priority: "passive-dressing",
    prompt: null,
    radius: 0,
  };
  if (blueprint.family.startsWith("gold.") || blueprint.family.startsWith("mining.gold")) {
    return { ...base, enabled: true, action: "mine-gold", priority: "hero-resource", prompt: "Mine", radius: 1.35 };
  }
  if (blueprint.family.startsWith("mine.entrance") || blueprint.family.startsWith("mine.ore-cart")) {
    return { ...base, enabled: true, action: "inspect-mine", priority: "world-readable", prompt: archetype.includes("empty") ? "Load" : "Inspect", radius: 1.8 };
  }
  if (blueprint.family.startsWith("combat.cover")) {
    return { ...base, enabled: true, action: "take-cover", priority: "combat-readable", prompt: "Cover", radius: 2.2 };
  }
  if (blueprint.family.startsWith("town.frontage") || blueprint.family.startsWith("town.water")) {
    return { ...base, enabled: true, action: "inspect-town", priority: "navigation-readable", prompt: "Town", radius: 2.4 };
  }
  return base;
}

function createInteractionTarget(kit) {
  if (kit.interaction.action === "mine-gold") {
    return {
      type: "mining-site",
      siteId: "mine-seam-01",
      command: "holdMine",
      source: "object-protokit-affordance",
    };
  }
  if (kit.interaction.action === "take-cover") {
    return {
      type: "cover",
      command: "engageCover",
      source: "object-protokit-affordance",
    };
  }
  return {
    type: "inspect",
    command: "inspect",
    source: "object-protokit-affordance",
  };
}

function createAffordanceSelection({ selected, candidates, reason }) {
  return {
    contract: "goldrush-nearest-object-affordance-v1",
    domainPath: "n:gameplay:interaction-hold",
    source: "goldrush-procedural-object-protokits",
    reason,
    selected: selected ? structuredClone(selected) : null,
    candidateCount: candidates.length,
    candidates: structuredClone(candidates),
  };
}

function priorityRank(priority) {
  if (priority === "hero-resource") return 4;
  if (priority === "combat-readable") return 3;
  if (priority === "world-readable") return 2;
  if (priority === "navigation-readable") return 1;
  return 0;
}

function distance2D(a, b) {
  return Math.hypot(Number(a.x ?? 0) - Number(b.x ?? 0), Number(a.z ?? 0) - Number(b.z ?? 0));
}

function domainScopeForFamily(family) {
  if (family.startsWith("gold.") || family.startsWith("mining.")) return "resource-readability";
  if (family.startsWith("combat.")) return "combat-cover";
  if (family.startsWith("trail.")) return "navigation";
  if (family.startsWith("town.") || family.startsWith("camp.") || family.startsWith("mine.")) return "settlement-and-mine";
  if (family.startsWith("canyon.")) return "terrain-depth";
  if (family.startsWith("plant.")) return "desert-foliage";
  return "terrain-dressing";
}

function environmentSpaceIdForZone(zone) {
  const map = {
    "open-field": "space.canyon-basin",
    "trail-edge": "space.wash-floor-trail",
    trailEdgeZone: "space.wash-floor-trail",
    "main-trail": "space.wash-floor-trail",
    "canyon-rim": "space.west-ridge-wall",
    canyonWallZone: "space.west-ridge-wall",
    canyonFloorZone: "space.canyon-basin",
    "combat-lane": "space.wash-floor-trail",
    "gold-field": "space.gold-seam",
    goldSeamZone: "space.gold-seam",
    "mine-pad": "space.mine-shelf",
    mineCampZone: "space.mine-shelf",
    "rail-bed": "space.mine-shelf",
    "camp-pad": "space.town-shelf",
    "town-edge": "space.town-shelf",
    townFrontageZone: "space.town-shelf",
    "vista-edge": "space.extraction-sightline",
  };
  return map[zone] ?? "space.canyon-basin";
}

function createVisualMetadata({ blueprint, archetype, seed }) {
  const silhouette = blueprint.role === "cover"
    ? "high"
    : blueprint.zone === "canyon-wall" || blueprint.role === "landmark-dressing"
      ? "medium"
      : "low";
  return {
    batchKey: `${blueprint.geometryRole}.${blueprint.materialRole}.${archetype}`,
    materialKey: blueprint.materialRole,
    resourceForm: blueprint.visualForm ?? null,
    lod: (seed % 7) < 5 ? "near" : "far",
    silhouette,
    paletteGroup: paletteForMaterial(blueprint.materialRole),
    impostorEligible: silhouette !== "high",
  };
}

function avoidTagsForZone(zone) {
  if (zone === "mineCampZone") return ["open-field-noise", "town-street", "main-trail-center"];
  if (zone === "goldSeamZone") return ["town-street", "camp-fire-ring", "open-field-noise"];
  if (zone === "canyonWallZone" || zone === "canyonFloorZone") return ["main-trail-center", "town-street"];
  if (zone === "trailEdgeZone") return ["town-street", "mine-interior-pad"];
  if (zone === "townFrontageZone") return ["main-trail-center", "mine-interior-pad", "open-field-noise"];
  if (zone === "main-trail") return ["mine-interior-pad", "town-street"];
  if (zone === "camp-pad" || zone === "town-edge") return ["main-trail-center", "rail-bed"];
  if (zone === "gold-field") return ["town-street", "camp-fire-ring"];
  if (zone === "rail-bed") return ["camp-sleep-pad", "town-street"];
  if (zone === "canyon-wall") return ["main-trail-center"];
  return ["town-street", "mine-interior-pad"];
}

function mineAnchorForFamily(family, seed) {
  if (family.includes("entrance-frame")) return { x: -8.9, z: 7.25 };
  if (family.includes("support-timber")) {
    const offsets = [
      [-9.5, 7.0], [-8.3, 7.0], [-8.9, 7.0],
      [-9.6, 7.6], [-8.2, 7.6], [-8.9, 7.72],
      [-9.4, 6.5], [-8.4, 6.45], [-7.9, 6.9],
      [-9.9, 6.9], [-7.7, 7.4], [-10.0, 7.4],
    ];
    const offset = offsets[seed % offsets.length];
    return { x: offset[0], z: offset[1] };
  }
  if (family.includes("ore-cart")) return { x: -5.4 + ((seed >>> 4) % 2) * 1.2, z: 4.35 + ((seed >>> 8) % 2) * 0.35 };
  if (family.includes("tailings-pile")) return { x: -7.0 + (((seed >>> 4) % 100) / 100 - 0.5) * 4.8, z: 5.9 + (((seed >>> 12) % 100) / 100 - 0.5) * 2.4 };
  if (family.includes("lantern-post")) return { x: -10.4 + ((seed >>> 6) % 4) * 1.15, z: 5.8 + ((seed >>> 10) % 2) * 1.5 };
  if (family.includes("warning-sign")) return { x: -10.2 + ((seed >>> 5) % 3) * 1.3, z: 4.55 + ((seed >>> 8) % 2) * 0.8 };
  return { x: -7.2, z: 5.3 };
}

function paletteForMaterial(materialRole) {
  if (materialRole.includes("rock") || materialRole === "stone" || materialRole === "ore") return "warm-stone";
  if (materialRole === "gold") return "reward-gold";
  if (materialRole === "cactus" || materialRole === "scrub" || materialRole === "dry-grass") return "desert-plant";
  if (materialRole === "wood" || materialRole === "canvas" || materialRole === "metal") return "settlement-prop";
  return "sand-atmosphere";
}

function gameplayTagsForFamily(family) {
  if (family.startsWith("mining.")) return ["prospect", "reward-readability"];
  if (family.startsWith("combat.")) return ["cover", "combat-readability"];
  if (family.startsWith("trail.")) return ["navigation", "path-readability"];
  if (family.startsWith("camp.") || family.startsWith("town.")) return ["settlement", "human-scale"];
  if (family.startsWith("canyon.")) return ["landmark", "terrain-depth"];
  return ["terrain-dressing"];
}

function hash(input) {
  let value = 2166136261;
  for (let index = 0; index < input.length; index += 1) {
    value ^= input.charCodeAt(index);
    value = Math.imul(value, 16777619);
  }
  return value >>> 0;
}
