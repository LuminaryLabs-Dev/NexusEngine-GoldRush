export function createGoldRushEnvironmentSpace({ terrain }) {
  const spaces = [
    {
      id: "space.canyon-basin",
      kind: "basin",
      role: "primary-playable-volume",
      bounds: rect(-terrain.width * 0.34, -terrain.depth * 0.36, terrain.width * 0.68, terrain.depth * 0.72),
      verticalRole: "low-wash-floor",
      sightlineRole: "long-forward-read",
      placementRules: ["keep-route-readable", "cluster-props-at-edges", "avoid-picture-copy-composition"],
    },
    {
      id: "space.wash-floor-trail",
      kind: "path-corridor",
      role: "movement-and-extraction-readability",
      bounds: rect(-terrain.width * 0.48, -terrain.depth * 0.25, terrain.width * 0.96, terrain.depth * 0.5),
      verticalRole: "depressed-trail-bed",
      sightlineRole: "must-stay-clear",
      placementRules: ["no-large-clutter", "ruts-follow-flow", "small-props-only-on-edges"],
    },
    {
      id: "space.west-ridge-wall",
      kind: "canyon-wall",
      role: "geologic-container",
      bounds: rect(terrain.bounds.minX, terrain.bounds.minZ, terrain.width * 0.2, terrain.depth),
      verticalRole: "high-stepped-red-rock",
      sightlineRole: "left-depth-wall",
      placementRules: ["large-rock-first", "strata-horizontal", "talus-at-base"],
    },
    {
      id: "space.east-ridge-wall",
      kind: "canyon-wall",
      role: "geologic-container",
      bounds: rect(terrain.bounds.maxX - terrain.width * 0.2, terrain.bounds.minZ, terrain.width * 0.2, terrain.depth),
      verticalRole: "high-stepped-red-rock",
      sightlineRole: "right-depth-wall",
      placementRules: ["large-rock-first", "strata-horizontal", "talus-at-base"],
    },
    {
      id: "space.mine-shelf",
      kind: "work-site",
      role: "resource-origin-and-landmark",
      bounds: rect(-18, 4.8, 13.5, 8.2),
      verticalRole: "cut-into-ridge-shelf",
      sightlineRole: "midground-focal-landmark",
      placementRules: ["portal-embedded-in-wall", "rail-follows-shelf", "tailings-fall-downhill"],
    },
    {
      id: "space.town-shelf",
      kind: "settlement",
      role: "human-scale-navigation-and-cover",
      bounds: rect(1.8, 5.8, 15.5, 7.8),
      verticalRole: "flat-built-shelf",
      sightlineRole: "right-midground-silhouette",
      placementRules: ["street-line-readable", "false-fronts-face-trail", "water-tower-breaks-skyline"],
    },
    {
      id: "space.gold-seam",
      kind: "resource-face",
      role: "reward-readability",
      bounds: rect(-17.5, 5.2, 15.5, 4.4),
      verticalRole: "wall-and-tailings-interface",
      sightlineRole: "glint-on-geologic-edge",
      placementRules: ["gold-in-rock-not-confetti", "claim-markers-near-seams", "glints-capped"],
    },
    {
      id: "space.extraction-sightline",
      kind: "route-vista",
      role: "cashout-pressure-direction",
      bounds: rect(-8, -terrain.depth * 0.45, terrain.width * 0.7, terrain.depth * 0.28),
      verticalRole: "open-vista",
      sightlineRole: "far-route-proof",
      placementRules: ["silhouette-only-far-props", "clear-horizon-gap", "camera-can-read-exit"],
    },
  ];

  return {
    id: "goldrush.worldUnderstanding.environmentSpace",
    source: "spatial-understanding-not-reference-image-copy",
    principles: [
      "model-the-playable-environment-before-modeling-props",
      "props-exist-because-of-geology-settlement-or-route-use",
      "the-reference-image-informs-vocabulary-not-composition",
      "clear-wash-floor-and-sightlines-come-before-object-count",
      "mine-town-gold-and-canyon-placement-must-explain-the-space",
    ],
    spaces,
    physicalForms: [
      {
        id: "form.wash-floor.trail-cut",
        kind: "trail-cut-bank-pair",
        spaceId: "space.wash-floor-trail",
        role: "make-the-route-read-as-a-depressed-wash",
        transform: { x: 0, z: -1.2, width: terrain.width * 0.92, depth: 8.6, height: 0.34, yaw: -0.18 },
        materialKey: "warm-sand-cut",
      },
      {
        id: "form.mine.shelf-plateau",
        kind: "raised-work-shelf",
        spaceId: "space.mine-shelf",
        role: "physically group portal rail cart tailings and seam",
        transform: { x: -9.2, z: 7.2, width: 16.2, depth: 8.8, height: 0.46, yaw: 0.03 },
        materialKey: "packed-ore-shelf",
      },
      {
        id: "form.town.street-shelf",
        kind: "settlement-street-shelf",
        spaceId: "space.town-shelf",
        role: "make town a shelf and street rather than scattered boxes",
        transform: { x: 8.4, z: 8.8, width: 17.5, depth: 7.2, height: 0.28, yaw: -0.04 },
        materialKey: "dust-street",
      },
      {
        id: "form.gold.seam-wall",
        kind: "vertical-resource-face",
        spaceId: "space.gold-seam",
        role: "put gold into the rock face instead of random confetti",
        transform: { x: -10.3, z: 9.1, width: 12.4, depth: 1.2, height: 2.1, yaw: 0.08 },
        materialKey: "red-rock-gold-face",
      },
      {
        id: "form.west-ridge.terrace",
        kind: "stepped-ridge-terrace",
        spaceId: "space.west-ridge-wall",
        role: "make west wall feel like terrain mass",
        transform: { x: -41.5, z: 4.5, width: 9.8, depth: 54, height: 1.15, yaw: -0.03 },
        materialKey: "red-rock-terrace",
      },
      {
        id: "form.east-ridge.terrace",
        kind: "stepped-ridge-terrace",
        spaceId: "space.east-ridge-wall",
        role: "make east wall feel like terrain mass",
        transform: { x: 41.5, z: 4.5, width: 9.8, depth: 54, height: 1.15, yaw: 0.03 },
        materialKey: "red-rock-terrace",
      },
      {
        id: "form.extraction.vista-floor",
        kind: "open-vista-floor",
        spaceId: "space.extraction-sightline",
        role: "preserve a readable cashout direction",
        transform: { x: 18, z: -19, width: 48, depth: 12, height: 0.08, yaw: -0.08 },
        materialKey: "pale-route-vista",
      },
    ],
  };
}

export function validateGoldRushEnvironmentSpace(descriptor) {
  if (descriptor?.id !== "goldrush.worldUnderstanding.environmentSpace") return false;
  if (!descriptor.source?.includes("not-reference-image-copy")) return false;
  if (descriptor.principles?.length < 5) return false;
  const ids = new Set(descriptor.spaces?.map((space) => space.id));
  const required = [
    "space.canyon-basin",
    "space.wash-floor-trail",
    "space.west-ridge-wall",
    "space.east-ridge-wall",
    "space.mine-shelf",
    "space.town-shelf",
    "space.gold-seam",
    "space.extraction-sightline",
  ];
  const formIds = new Set(descriptor.physicalForms?.map((form) => form.id));
  const requiredForms = [
    "form.wash-floor.trail-cut",
    "form.mine.shelf-plateau",
    "form.town.street-shelf",
    "form.gold.seam-wall",
    "form.extraction.vista-floor",
  ];
  return required.every((id) => ids.has(id))
    && requiredForms.every((id) => formIds.has(id))
    && descriptor.spaces.every((space) => (
      space.bounds
      && Number.isFinite(space.bounds.x)
      && Number.isFinite(space.bounds.z)
      && space.bounds.width > 0
      && space.bounds.depth > 0
      && space.placementRules?.length >= 3
      && space.sightlineRole
    ))
    && descriptor.physicalForms.every((form) => (
      form.spaceId
      && ids.has(form.spaceId)
      && form.transform?.width > 0
      && form.transform?.depth > 0
      && form.transform?.height > 0
      && form.role
    ));
}

function rect(x, z, width, depth) {
  return {
    x: Number(x.toFixed(3)),
    z: Number(z.toFixed(3)),
    width: Number(width.toFixed(3)),
    depth: Number(depth.toFixed(3)),
  };
}
