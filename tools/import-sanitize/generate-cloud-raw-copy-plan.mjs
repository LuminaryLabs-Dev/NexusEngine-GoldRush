import { dirname, join, resolve } from "node:path";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const defaultInventoryPath = "reports/provenance/goldrush-dual-source-001-candidate-inventory.json";
const defaultSlicePath = "manifests/import-jobs/goldrush-cloud-first-copy-slice.json";

const selectedPathPlans = {
  "audio-music-and-sfx": [
    ["goldrush.audio.music.wandering", "GoldRush_Old/Assets/_GOLDRUSH/06_Audio/WanderingSongs/Riding Into The Sun - Telecasted.mp3", "best-named-western-travel-track"],
    ["goldrush.audio.music.combat", "GoldRush_Old/Assets/_GOLDRUSH/06_Audio/CombatSongs/Raging Streets - SefChol.mp3", "best-named-combat-energy-track"],
    ["goldrush.audio.sfx.revolverShot", "GoldRush_Old/Assets/_GOLDRUSH/06_Audio/GoldShotSound.ogg", "legacy-gold-shot-sound-cue"],
  ],
  "legacy-scene-layout-metadata": [
    ["goldrush.scene.mainMenu", "GoldRush_Old/Assets/_GOLDRUSH/00_Scenes/MainMenu.unity", "classic-main-menu-layout"],
    ["goldrush.scene.lobby", "GoldRush/Assets/Scenes/Lobby.unity", "modern-lobby-layout"],
    ["goldrush.scene.arena", "GoldRush/Assets/Scenes/Arena.unity", "modern-arena-layout"],
    ["goldrush.scene.playerTest", "GoldRush/Assets/Entities/Player/PlayerTest.unity", "modern-player-controller-test-layout"],
    ["goldrush.scene.legacyGame", "GoldRush_Old/Assets/_GOLDRUSH/00_Scenes/Game.unity", "classic-combat-layout"],
    ["goldrush.scene.legacySinglePlayer", "GoldRush_Old/Assets/_GOLDRUSH/00_Scenes/Game_SinglePlayer.unity", "classic-solo-layout"],
  ],
  "player-combat-character": [
    ["goldrush.player.prospector", "GoldRush_Old/Assets/_GOLDRUSH/02_Prefabs/Player.prefab", "classic-player-prefab"],
    ["goldrush.player.prospector", "GoldRush/Assets/Entities/Player/MixamoAnimations/The Boss.fbx", "modern-humanoid-model-candidate"],
    ["goldrush.player.prospector", "GoldRush/Assets/Entities/Player/MixamoAnimations/Boss_diffuse.png", "modern-humanoid-diffuse"],
    ["goldrush.player.prospector", "GoldRush/Assets/Entities/Player/MixamoAnimations/Boss_normal.png", "modern-humanoid-normal"],
    ["goldrush.weapon.revolver", "GoldRush/Assets/Entities/Items/Revolver.prefab", "modern-revolver-prefab"],
    ["goldrush.weapon.revolver", "GoldRush/Assets/Imported/Xander-Revolver/drive-download-20250223T062959Z-001/Revolver1.fbx", "modern-revolver-model"],
    ["goldrush.weapon.revolver", "GoldRush/Assets/Imported/Xander-Revolver/drive-download-20250223T062959Z-001/Revolver1Diff.png", "modern-revolver-diffuse"],
    ["goldrush.weapon.revolver", "GoldRush/Assets/Imported/Xander-Revolver/drive-download-20250223T062959Z-001/Revolver1Normal.png", "modern-revolver-normal"],
    ["goldrush.anim.player.idle", "GoldRush_Old/Assets/_GOLDRUSH/10_Animations/Player/Breathing Idle.anim", "classic-player-idle-animation"],
    ["goldrush.anim.player.run", "GoldRush_Old/Assets/_GOLDRUSH/10_Animations/Player/Running.anim", "classic-player-run-animation"],
    ["goldrush.anim.player.shooting", "GoldRush_Old/Assets/_GOLDRUSH/10_Animations/Player/Gunplay.anim", "classic-gunplay-animation"],
  ],
  "mine-town-terrain-props": [
    ["goldrush.vehicle.train", "GoldRush/Assets/Entities/Vehicles/TrainEntity.prefab", "modern-train-entity-prefab"],
    ["goldrush.vehicle.train", "GoldRush/Assets/World/ImportedModels/train-track-modular-pack/source/Train_MP.fbx", "train-track-model-source"],
    ["goldrush.vehicle.trainCar", "GoldRush/Assets/Entities/LobbyTrainCar.prefab", "modern-lobby-train-car"],
    ["goldrush.vehicle.trainCar", "GoldRush/Assets/Entities/LobbyTrainCar02.prefab", "modern-lobby-train-car-variant"],
    ["goldrush.prop.goldPile", "GoldRush_Old/Assets/_GOLDRUSH/02_Prefabs/Pile O' Gold.prefab", "classic-gold-pile-prefab"],
    ["goldrush.prop.goldPile", "GoldRush_Old/Assets/_GOLDRUSH/02_Prefabs/Pile O' Gold SpawnArea.prefab", "classic-gold-spawn-area-prefab"],
    ["goldrush.currency.coin01", "GoldRush/Assets/World/ImportedModels/Wild West Western/Models/Coin_01.fbx", "western-coin-model"],
    ["goldrush.prop.cactus01", "GoldRush/Assets/World/ImportedModels/Wild West Western/Models/Cactus_01.fbx", "western-cactus-variant-one"],
    ["goldrush.prop.cactus02", "GoldRush/Assets/World/ImportedModels/Wild West Western/Models/Cactus_02.fbx", "western-cactus-variant-two"],
    ["goldrush.prop.fence01", "GoldRush/Assets/World/Buildings/Fence01.prefab", "modern-fence-prefab"],
    ["goldrush.prop.fence01", "GoldRush/Assets/World/ImportedModels/Fences/source/ENV_FenceKit_HenryB_001.fbx", "fence-kit-model-source"],
  ],
};

const manualDeferredSlots = {
  "audio-music-and-sfx": [
    ["goldrush.audio.music.boss", "no boss-named track found in metadata inventory"],
    ["goldrush.audio.sfx.goldPickup", "no pickup-named cue found in metadata inventory"],
    ["goldrush.audio.sfx.cashout", "no cashout-named cue found in metadata inventory"],
    ["goldrush.audio.sfx.ambush", "no ambush-named cue found in metadata inventory"],
    ["goldrush.audio.sfx.playerDown", "no player-down cue found in metadata inventory"],
  ],
  "player-combat-character": [
    ["goldrush.anim.player.aimIdle", "no aim-idle named clip found; Gunplay may be retarget source after review"],
    ["goldrush.anim.player.aimRun", "no aim-run named clip found; Gunplay may be retarget source after review"],
    ["goldrush.anim.player.dead", "no player death clip found; non-player die clips need review before reuse"],
  ],
};

export function createCloudRawCopyPlan({
  inventoryPath = defaultInventoryPath,
  slicePath = defaultSlicePath,
  generatedAt = new Date().toISOString(),
} = {}) {
  const inventory = readJson(inventoryPath);
  const slice = readJson(slicePath);
  const failures = [];

  expect(inventory.schema === "nexusengine.goldrush.cloud-candidate-inventory.v1", "invalid-inventory-schema", failures);
  expect(inventory.importJobId === slice.importJobId, "import-job-mismatch", failures);
  expect(inventory.generatedFrom?.localCloneCreated === false, "inventory-must-not-use-local-clone", failures);

  const inventoryByPath = new Map(
    (inventory.domains ?? []).flatMap((domain) => domain.candidates.map((candidate) => [candidate.path, { domainId: domain.id, candidate }]))
  );
  const sliceDomains = new Map((slice.firstCopyDomains ?? []).map((domain) => [domain.id, domain]));

  const domains = [...sliceDomains.values()].map((sliceDomain) => {
    const selected = (selectedPathPlans[sliceDomain.id] ?? []).map(([slotId, sourcePath, reason]) => {
      const inventoryRecord = inventoryByPath.get(sourcePath);
      expect(Boolean(inventoryRecord), `selected-source-not-in-inventory:${sourcePath}`, failures);
      if (inventoryRecord) expect(inventoryRecord.domainId === sliceDomain.id || canShareAcrossDomains(slotId), `selected-source-domain-mismatch:${sourcePath}`, failures);
      expect((sliceDomain.requiredSlots ?? []).includes(slotId) || canShareAcrossDomains(slotId), `selected-slot-not-required:${sliceDomain.id}:${slotId}`, failures);
      return {
        slotId,
        sourcePath,
        blobSha: inventoryRecord?.candidate.blobSha ?? null,
        sizeBytes: inventoryRecord?.candidate.sizeBytes ?? null,
        extension: inventoryRecord?.candidate.extension ?? null,
        reason,
        targetRawPath: `raw/imported/${slice.importJobId}/${sourcePath}`,
        promoteOnlyAfter: ["deny-path-scan", "secret-scan", "copy-ledger", "hash-manifest", "classification", "conversion-report", "license-provenance", "human-review"],
      };
    });

    const selectedSlots = new Set(selected.map((entry) => entry.slotId));
    const deferred = [
      ...(manualDeferredSlots[sliceDomain.id] ?? []).map(([slotId, reason]) => ({ slotId, reason })),
      ...(sliceDomain.requiredSlots ?? [])
        .filter((slotId) => !selectedSlots.has(slotId) && !(manualDeferredSlots[sliceDomain.id] ?? []).some(([manualSlot]) => manualSlot === slotId))
        .map((slotId) => ({ slotId, reason: "no deterministic first-pass candidate selected" })),
    ];

    return {
      id: sliceDomain.id,
      priority: sliceDomain.priority,
      selectedCount: selected.length,
      deferredCount: deferred.length,
      selected,
      deferred,
    };
  });

  assert(failures.length === 0, `cannot generate raw copy plan: ${failures.join(", ")}`);

  return {
    schema: "nexusengine.goldrush.cloud-raw-copy-plan.v1",
    importJobId: slice.importJobId,
    generatedAt,
    generatedFrom: {
      candidateInventory: inventoryPath,
      firstCopySlice: slicePath,
      method: "metadata-plan-no-local-clone-no-file-content",
      localCloneCreated: false,
    },
    source: {
      nameWithOwner: inventory.source.nameWithOwner,
      branch: inventory.source.branch,
      commitSha: inventory.source.commitSha,
    },
    destination: {
      rawImportBranch: slice.destination.rawImportBranch,
      rawRoot: slice.destination.rawRoot,
    },
    domains,
    totals: {
      domains: domains.length,
      selectedFiles: domains.reduce((sum, domain) => sum + domain.selectedCount, 0),
      deferredSlots: domains.reduce((sum, domain) => sum + domain.deferredCount, 0),
      selectedBytes: domains.flatMap((domain) => domain.selected).reduce((sum, entry) => sum + entry.sizeBytes, 0),
    },
    notes: [
      "This is a copy plan only; no source file contents are copied by this report.",
      "The cloud worker must still write all six receipt files on the raw import branch.",
      "Deferred slots are explicit so missing audio/animation cues are not mistaken for parity.",
    ],
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const args = parseArgs(process.argv.slice(2));
  const report = createCloudRawCopyPlan({
    inventoryPath: args.inventoryPath ?? defaultInventoryPath,
    slicePath: args.slicePath ?? defaultSlicePath,
    generatedAt: args.generatedAt ?? new Date().toISOString(),
  });
  const serialized = `${JSON.stringify(report, null, 2)}\n`;
  if (args.out) {
    const outPath = normalizeRepoPath(args.out);
    mkdirSync(dirname(join(repoRoot, outPath)), { recursive: true });
    writeFileSync(join(repoRoot, outPath), serialized);
    console.log(JSON.stringify({ status: "cloud-raw-copy-plan-written", path: outPath }, null, 2));
  } else {
    process.stdout.write(serialized);
  }
}

function canShareAcrossDomains(slotId) {
  return [
    "goldrush.player.prospector",
    "goldrush.weapon.revolver",
    "goldrush.scene.mainMenu",
  ].includes(slotId);
}

function readJson(relPath) {
  return JSON.parse(readFileSync(join(repoRoot, normalizeRepoPath(relPath)), "utf8"));
}

function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--inventory") args.inventoryPath = argv[++index];
    else if (arg === "--slice") args.slicePath = argv[++index];
    else if (arg === "--generated-at") args.generatedAt = argv[++index];
    else if (arg === "--out") args.out = argv[++index];
    else throw new Error(`unknown argument: ${arg}`);
  }
  return args;
}

function normalizeRepoPath(value) {
  assert(typeof value === "string" && value.length > 0, "path is required");
  assert(!value.startsWith("/"), `absolute path is not allowed: ${value}`);
  assert(!value.includes("\\"), `backslash path is not allowed: ${value}`);
  assert(!value.includes("\0"), "null byte path is not allowed");
  assert(!value.split("/").includes(".."), `path traversal is not allowed: ${value}`);
  assert(!/^(https?:|data:|blob:|file:|\/\/)/i.test(value), `url path is not allowed: ${value}`);
  return value;
}

function expect(condition, message, failures) {
  if (!condition) failures.push(message);
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
