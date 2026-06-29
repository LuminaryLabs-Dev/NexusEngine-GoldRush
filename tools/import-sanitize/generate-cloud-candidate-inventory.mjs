import { execFileSync } from "node:child_process";
import { dirname, extname, join, resolve } from "node:path";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const defaultSlicePath = "manifests/import-jobs/goldrush-cloud-first-copy-slice.json";

export function createCloudCandidateInventory({
  slicePath = defaultSlicePath,
  generatedAt = new Date().toISOString(),
  tree = null,
} = {}) {
  const slice = readJson(slicePath);
  const source = slice.source;
  const sourceTree = tree ?? fetchGitHubTree(source.nameWithOwner, source.headSha);
  const failures = [];

  expect(sourceTree.sha === source.headSha, "source-tree-sha-mismatch", failures);
  expect(sourceTree.truncated === false, "source-tree-must-not-be-truncated", failures);
  expect(Array.isArray(sourceTree.tree), "source-tree-missing-tree-array", failures);

  const blobs = sourceTree.tree
    .filter((entry) => entry.type === "blob")
    .map((entry) => ({
      path: entry.path,
      blobSha: entry.sha,
      sizeBytes: entry.size ?? 0,
      extension: extname(entry.path).toLowerCase(),
    }));

  const domains = (slice.firstCopyDomains ?? []).map((domain) => {
    const matched = blobs
      .filter((entry) => candidateMatchesDomain(entry, domain))
      .map((entry) => ({
        path: entry.path,
        blobSha: entry.blobSha,
        sizeBytes: entry.sizeBytes,
        extension: entry.extension,
        matchReasons: candidateMatchReasons(entry, domain),
        sourceRoot: matchingRoot(entry.path, domain.sourceRoots),
        denied: isDeniedPath(entry.path),
      }))
      .sort((a, b) => a.path.localeCompare(b.path));

    const requiredSourcePaths = domain.requiredSourcePaths ?? [];
    const matchedPaths = new Set(matched.map((candidate) => candidate.path));
    const missingRequiredSourcePaths = requiredSourcePaths.filter((requiredPath) => !matchedPaths.has(requiredPath));

    expect(missingRequiredSourcePaths.length === 0, `domain-missing-required-source-path:${domain.id}`, failures);
    expect(matched.every((candidate) => candidate.denied === false), `domain-has-denied-candidate:${domain.id}`, failures);

    return {
      id: domain.id,
      priority: domain.priority,
      reason: domain.reason,
      requiredSlots: domain.requiredSlots,
      allowExtensions: domain.allowExtensions,
      pathHints: domain.pathHints ?? [],
      requiredSourcePaths,
      missingRequiredSourcePaths,
      candidateCount: matched.length,
      totalSizeBytes: matched.reduce((sum, candidate) => sum + candidate.sizeBytes, 0),
      candidates: matched,
    };
  });

  assert(failures.length === 0, `cannot generate candidate inventory: ${failures.join(", ")}`);

  return {
    schema: "nexusengine.goldrush.cloud-candidate-inventory.v1",
    importJobId: slice.importJobId,
    generatedAt,
    generatedFrom: {
      firstCopySlice: slicePath,
      method: "github-api-tree-metadata-no-local-clone",
      localCloneCreated: false,
    },
    source: {
      nameWithOwner: source.nameWithOwner,
      branch: source.branch,
      commitSha: source.headSha,
      treeTruncated: sourceTree.truncated,
      treeEntryCount: sourceTree.tree.length,
    },
    domains,
    totals: {
      domains: domains.length,
      candidates: domains.reduce((sum, domain) => sum + domain.candidateCount, 0),
      totalSizeBytes: domains.reduce((sum, domain) => sum + domain.totalSizeBytes, 0),
    },
    notes: [
      "This is metadata-only candidate inventory from the GitHub tree API.",
      "No legacy file contents are copied by this report.",
      "A later cloud import branch must still produce deny scan, secret scan, copy ledger, hash manifest, and classification receipts.",
    ],
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const args = parseArgs(process.argv.slice(2));
  const report = createCloudCandidateInventory({
    slicePath: args.slicePath ?? defaultSlicePath,
    generatedAt: args.generatedAt ?? new Date().toISOString(),
  });
  const serialized = `${JSON.stringify(report, null, 2)}\n`;
  if (args.out) {
    const outPath = normalizeRepoPath(args.out);
    mkdirSync(dirname(join(repoRoot, outPath)), { recursive: true });
    writeFileSync(join(repoRoot, outPath), serialized);
    console.log(JSON.stringify({ status: "cloud-candidate-inventory-written", path: outPath }, null, 2));
  } else {
    process.stdout.write(serialized);
  }
}

function fetchGitHubTree(nameWithOwner, commitSha) {
  const apiPath = `repos/${nameWithOwner}/git/trees/${commitSha}?recursive=1`;
  const output = execFileSync("gh", ["api", apiPath], {
    cwd: repoRoot,
    encoding: "utf8",
    maxBuffer: 1024 * 1024 * 16,
  });
  return JSON.parse(output);
}

function candidateMatchesDomain(entry, domain) {
  if (!domainAllowsExtension(entry, domain)) return false;
  if (isDeniedPath(entry.path)) return false;
  if (!matchingRoot(entry.path, domain.sourceRoots)) return false;
  return candidateMatchReasons(entry, domain).length > 0;
}

function candidateMatchReasons(entry, domain) {
  const reasons = [];
  if ((domain.requiredSourcePaths ?? []).includes(entry.path)) reasons.push("required-source-path");
  const lowerPath = entry.path.toLowerCase();
  for (const hint of domain.pathHints ?? []) {
    if (matchesHint(lowerPath, hint)) reasons.push(`path-hint:${hint}`);
  }
  return reasons;
}

function matchesHint(lowerPath, hint) {
  const normalizedHint = hint.toLowerCase();
  if (normalizedHint.startsWith("**/*") && !normalizedHint.endsWith("*")) {
    return lowerPath.includes(normalizedHint.slice(4));
  }
  if (normalizedHint.startsWith("**/*") && normalizedHint.endsWith("*")) {
    return lowerPath.includes(normalizedHint.slice(4, -1));
  }
  if (normalizedHint.startsWith("**/") && normalizedHint.endsWith("/**")) {
    return lowerPath.includes(`/${normalizedHint.slice(3, -3).replaceAll("/", "")}/`)
      || lowerPath.includes(normalizedHint.slice(3, -3));
  }
  return lowerPath.includes(normalizedHint.replaceAll("*", "").toLowerCase());
}

function domainAllowsExtension(entry, domain) {
  return (domain.allowExtensions ?? []).map((ext) => ext.toLowerCase()).includes(entry.extension);
}

function matchingRoot(entryPath, roots = []) {
  return roots.find((root) => entryPath.startsWith(root)) ?? null;
}

function isDeniedPath(value) {
  const normalized = `/${value}`;
  const deniedFragments = [
    "/Packages/manifest.json",
    "/Packages/packages-lock.json",
    "/ProjectSettings/",
    "/UserSettings/",
    "/Library/",
    "/Temp/",
    "/Obj/",
    "/Logs/",
    "/Build/",
    "/Builds/",
    "/Assets/Photon/",
    "/Assets/Photon",
    "/Assets/Plugins/",
    "/PhotonAppSettings.asset",
  ];
  const deniedSuffixes = [".csproj", ".sln", ".env", ".npmrc", ".upmconfig.toml"];
  return deniedFragments.some((fragment) => normalized.includes(fragment))
    || deniedSuffixes.some((suffix) => normalized.endsWith(suffix));
}

function readJson(relPath) {
  const safePath = normalizeRepoPath(relPath);
  return JSON.parse(readFileSync(join(repoRoot, safePath), "utf8"));
}

function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--slice") args.slicePath = argv[++index];
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
