import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import {
  sanitizePathForOutput,
  sanitizedConsoleJson,
  writeSanitizedJsonArtifact,
  writeSanitizedTextArtifact,
} from "../safety/publicArtifactSanitizer.mjs";

const args = parseArgs(process.argv.slice(2));
const repoRoot = path.resolve(new URL("../..", import.meta.url).pathname);
const baseUrl = args.url || process.env.GOLDRUSH_LOCAL_URL || "http://127.0.0.1:5177/NexusEngine-GoldRush/";
const proofUrl = withProofParam(baseUrl);
const outputRoot = path.resolve(args.out ?? "output/playwright/peer-party-boarding-proof");
const screenshotRoot = path.resolve(args.screenshots ?? outputRoot);
const timeoutMs = Number(args.timeout ?? 65000);
const headed = args.headed === "true" || args.headed === true;
const scenario = String(args.scenario ?? "all-ready");
const runId = new Date().toISOString().replace(/[:.]/g, "-");
const reportPath = path.join(outputRoot, `peer-party-boarding-${runId}.json`);
const markdownPath = path.join(outputRoot, `peer-party-boarding-${runId}.md`);

await mkdir(outputRoot, { recursive: true });
await mkdir(screenshotRoot, { recursive: true });

const report = {
  status: "pending",
  url: proofUrl,
  startedAt: new Date().toISOString(),
  steps: [],
  screenshots: [],
  consoleErrors: [],
  pageErrors: [],
  scenario,
  hostState: null,
  memberState: null,
};

let browser;
let hostPage;
let memberPage;
let memberContext;

try {
  browser = await chromium.launch({ headless: !headed });
  const hostContext = await browser.newContext({ viewport: { width: 1280, height: 820 }, deviceScaleFactor: 1 });
  memberContext = await browser.newContext({ viewport: { width: 1280, height: 820 }, deviceScaleFactor: 1 });
  hostPage = await hostContext.newPage();
  memberPage = await memberContext.newPage();
  bindPageDiagnostics(hostPage, "host");
  bindPageDiagnostics(memberPage, "member");

  await step("load-two-tabs", async () => {
    await Promise.all([
      gotoWithRetry(hostPage, proofUrl, { timeoutMs }),
      gotoWithRetry(memberPage, proofUrl, { timeoutMs }),
    ]);
    await Promise.all([
      hostPage.locator('[data-action="play-title"]').waitFor({ state: "visible", timeout: timeoutMs }),
      memberPage.locator('[data-action="play-title"]').waitFor({ state: "visible", timeout: timeoutMs }),
    ]);
    await capture(hostPage, "01-host-title");
    await capture(memberPage, "01-member-title");
  });

  await step("enter-lobbies", async () => {
    await Promise.all([
      hostPage.locator('[data-action="play-title"]').click(),
      memberPage.locator('[data-action="play-title"]').click(),
    ]);
    await Promise.all([
      waitForScreen(hostPage, "lobby", timeoutMs),
      waitForScreen(memberPage, "lobby", timeoutMs),
    ]);
  });

  let roomCode;
  await step("create-and-join-peer-party", async () => {
    await hostPage.locator('[data-action="create-party"]').click();
    await hostPage.waitForFunction(() => {
      const party = window.GoldRushHost?.getState?.().party;
      return party?.roomCode && party?.status === "hosting";
    }, null, { timeout: timeoutMs });
    roomCode = (await getHostState(hostPage)).party.roomCode;
    await memberPage.locator("[data-party-code-input]").fill(roomCode);
    await memberPage.locator('[data-action="join-party"]').click();
    await hostPage.waitForFunction(() => {
      const party = window.GoldRushHost?.getState?.().party;
      return party?.members?.length === 2;
    }, null, { timeout: timeoutMs });
    await memberPage.waitForFunction(() => {
      const party = window.GoldRushHost?.getState?.().party;
      return party?.status === "joined" && party?.members?.length === 2;
    }, null, { timeout: timeoutMs });
    await capture(hostPage, "02-host-party");
    await capture(memberPage, "02-member-party");
  });

  await step("leader-launches-loading-yard", async () => {
    await hostPage.locator('[data-action="enter-run"]').click();
    await Promise.all([
      waitForScreen(hostPage, "loading", timeoutMs),
      waitForScreen(memberPage, "loading", timeoutMs),
    ]);
    await Promise.all([
      waitForActiveSite(hostPage, "site.loading-yard", timeoutMs),
      waitForActiveSite(memberPage, "site.loading-yard", timeoutMs),
    ]);
    await capture(hostPage, "03-host-loading");
    await capture(memberPage, "03-member-loading");
  });

  await step(scenario === "disconnect" ? "host-boards-member-disconnects" : "both-members-board-train", async () => {
    if (scenario === "disconnect") {
      await runDisconnectScenario();
    } else {
      await runAllReadyScenario();
    }
  });

  await step("validate-peer-boarding-state", async () => {
    report.hostState = summarizeState(await getHostState(hostPage));
    if (scenario !== "disconnect") report.memberState = summarizeState(await getHostState(memberPage));
    assert(report.hostState.party.boarding.contract === "goldrush-peer-party-boarding-sync-v1", "host missing peer boarding contract");
    assert(report.hostState.firstSequence.boardingStatus.localBoarded === true, "host first sequence should be locally boarded");
    assert(report.hostState.firstSequence.peerHandoffGate.ready === true, "host peer handoff gate should be ready before departure");
    assert(report.hostState.firstSequence.phase === "train-departing" || report.hostState.firstSequence.phase === "handoff-ready", "host train should depart after boarding");
    if (scenario === "disconnect") {
      assert(report.hostState.party.members === 1, "disconnect scenario host should reduce to one party member");
      assert(report.hostState.party.boarding.expectedCount === 1, "disconnect scenario should reduce expected boarding count");
      assert(report.hostState.party.boarding.readyCount === 1, "disconnect scenario should keep remaining local player ready");
      assert(report.hostState.party.boarding.allReady === true, "disconnect scenario remaining roster should be ready");
      assert(report.hostState.party.boarding.disconnects.length === 1, "disconnect scenario should record one disconnect");
      assert(report.hostState.firstSequence.peerHandoffGate.required === false, "disconnect scenario peer gate should no longer be required");
      assert(report.hostState.firstSequence.peerHandoffGate.disconnectedMemberIds.length === 1, "disconnect scenario should expose disconnected member in handoff gate");
    } else {
      assert(report.hostState.party.members === 2, "host should see two party members");
      assert(report.memberState.party.members === 2, "member should see two party members");
      assert(report.memberState.party.boarding.contract === "goldrush-peer-party-boarding-sync-v1", "member missing peer boarding contract");
      assert(report.hostState.party.boarding.readyCount === 2, "host should see two ready boarded peers");
      assert(report.memberState.party.boarding.readyCount === 2, "member should see two ready boarded peers");
      assert(report.hostState.party.boarding.allReady === true, "host should see party all ready");
      assert(report.memberState.party.boarding.allReady === true, "member should see party all ready");
      assert(report.memberState.firstSequence.boardingStatus.localBoarded === true, "member first sequence should be locally boarded");
      assert(report.memberState.firstSequence.peerHandoffGate.ready === true, "member peer handoff gate should be ready before departure");
      assert(report.memberState.firstSequence.phase === "train-departing" || report.memberState.firstSequence.phase === "handoff-ready", "member train should depart after boarding");
    }
  });

  report.status = "passed";
} catch (error) {
  report.status = "failed";
  if (hostPage) {
    try {
      report.hostState = summarizeState(await getHostState(hostPage));
      await capture(hostPage, "99-host-failure");
    } catch (captureError) {
      report.hostCaptureError = captureError.message;
    }
  }
  if (memberPage) {
    try {
      report.memberState = summarizeState(await getHostState(memberPage));
      await capture(memberPage, "99-member-failure");
    } catch (captureError) {
      report.memberCaptureError = captureError.message;
    }
  }
  report.error = { message: error.message, stack: error.stack };
  process.exitCode = 1;
} finally {
  report.finishedAt = new Date().toISOString();
  await browser?.close();
  const publicReport = await writeSanitizedJsonArtifact(reportPath, report, { repoRoot });
  await writeSanitizedTextArtifact(markdownPath, renderMarkdown(publicReport), { repoRoot });
  console.log(sanitizedConsoleJson({
    status: publicReport.status,
    url: publicReport.url,
    report: sanitizePathForOutput(reportPath),
    markdown: sanitizePathForOutput(markdownPath),
    screenshots: publicReport.screenshots,
    hostState: publicReport.hostState,
    memberState: publicReport.memberState,
    error: publicReport.error?.message ?? null,
  }, { repoRoot }));
}

async function step(name, callback) {
  const startedAt = Date.now();
  try {
    await callback();
    report.steps.push({ name, status: "passed", durationMs: Date.now() - startedAt });
  } catch (error) {
    report.steps.push({ name, status: "failed", durationMs: Date.now() - startedAt, error: error.message });
    throw error;
  }
}

function bindPageDiagnostics(page, label) {
  page.on("console", (message) => {
    if (["error", "warning"].includes(message.type())) {
      report.consoleErrors.push({ page: label, type: message.type(), text: message.text() });
    }
  });
  page.on("pageerror", (error) => {
    report.pageErrors.push({ page: label, message: error.message });
  });
}

async function gotoWithRetry(page, url, { timeoutMs: timeout, attempts = 4 } = {}) {
  let lastError = null;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await page.goto(url, { waitUntil: "domcontentloaded", timeout });
      if (!response?.ok()) throw new Error(`URL returned HTTP ${response?.status() ?? "unknown"}`);
      await page.waitForLoadState("networkidle", { timeout: Math.min(timeout, 15000) }).catch(() => {});
      return response;
    } catch (error) {
      lastError = error;
      if (attempt < attempts) await page.waitForTimeout(1200 * attempt);
    }
  }
  throw lastError;
}

async function capture(page, name) {
  const file = path.join(screenshotRoot, `${name}-${runId}.png`);
  await page.screenshot({ path: file, fullPage: false });
  report.screenshots.push(sanitizePathForOutput(file));
}

async function waitForScreen(page, screen, timeout) {
  await page.waitForFunction((expected) => window.GoldRushHost?.getState?.().screen === expected, screen, { timeout });
}

async function waitForActiveSite(page, siteId, timeout) {
  await page.waitForFunction((expected) => window.GoldRushHost?.getState?.().sceneKitLoader?.activeSite?.id === expected, siteId, { timeout });
}

async function waitForTrainDoor(page, timeout) {
  await page.waitForFunction(() => window.GoldRushHost?.getState?.().loadingScene?.doorOpen === true, null, { timeout });
}

async function placeAtTrainDoor(page) {
  const receipt = await page.evaluate(() => window.GoldRushHost?.actions?.publicSmokePlaceAtTrainDoor?.() ?? { accepted: false, reason: "missing-action" });
  if (!receipt.accepted) throw new Error(`train-door placement failed: ${receipt.reason}`);
}

async function waitForLocalBoarding(page, timeout) {
  await page.waitForFunction(() => {
    const state = window.GoldRushHost?.getState?.();
    return state?.firstSequence?.boardingStatus?.localBoarded === true
      && state?.firstSequence?.playerLockedToTrain === true;
  }, null, { timeout });
}

async function runAllReadyScenario() {
  await Promise.all([
    waitForTrainDoor(hostPage, timeoutMs),
    waitForTrainDoor(memberPage, timeoutMs),
  ]);
  await Promise.all([
    placeAtTrainDoor(hostPage),
    placeAtTrainDoor(memberPage),
  ]);
  await Promise.all([
    waitForLocalBoarding(hostPage, timeoutMs),
    waitForLocalBoarding(memberPage, timeoutMs),
  ]);
  await Promise.all([
    waitForBoardingSyncPhase(hostPage, timeoutMs),
    waitForBoardingSyncPhase(memberPage, timeoutMs),
  ]);
  await hostPage.waitForFunction(() => {
    const boarding = window.GoldRushHost?.getState?.().party?.boarding;
    return boarding?.contract === "goldrush-peer-party-boarding-sync-v1"
      && boarding.expectedCount === 2
      && boarding.readyCount === 2
      && boarding.allReady === true;
  }, null, { timeout: timeoutMs });
  await memberPage.waitForFunction(() => {
    const boarding = window.GoldRushHost?.getState?.().party?.boarding;
    return boarding?.contract === "goldrush-peer-party-boarding-sync-v1"
      && boarding.expectedCount === 2
      && boarding.readyCount === 2
      && boarding.allReady === true;
  }, null, { timeout: timeoutMs });
  await Promise.all([
    waitForPeerGatedDeparture(hostPage, timeoutMs),
    waitForPeerGatedDeparture(memberPage, timeoutMs),
  ]);
  await capture(hostPage, "04-host-boarded");
  await capture(memberPage, "04-member-boarded");
}

async function runDisconnectScenario() {
  await Promise.all([
    waitForTrainDoor(hostPage, timeoutMs),
    waitForTrainDoor(memberPage, timeoutMs),
  ]);
  await placeAtTrainDoor(hostPage);
  await waitForLocalBoarding(hostPage, timeoutMs);
  await waitForBoardingSyncPhase(hostPage, timeoutMs);
  report.memberState = summarizeState(await getHostState(memberPage));
  await capture(hostPage, "04-host-waiting");
  await capture(memberPage, "04-member-before-disconnect");
  await memberPage.evaluate(() => window.GoldRushHost?.actions?.leaveParty?.());
  await memberContext.close();
  memberPage = null;
  await hostPage.waitForFunction(() => {
    const state = window.GoldRushHost?.getState?.();
    return state?.party?.members?.length === 1
      && state?.party?.boarding?.expectedCount === 1
      && state?.party?.boarding?.readyCount === 1
      && state?.party?.boarding?.disconnects?.length === 1
      && state?.firstSequence?.peerHandoffGate?.ready === true
      && state?.firstSequence?.peerHandoffGate?.required === false
      && (state?.firstSequence?.phase === "train-departing" || state?.firstSequence?.phase === "handoff-ready");
  }, null, { timeout: timeoutMs });
  await capture(hostPage, "05-host-disconnect-release");
}

async function waitForBoardingSyncPhase(page, timeout) {
  await page.waitForFunction(() => {
    const state = window.GoldRushHost?.getState?.();
    return state?.firstSequence?.phase === "boarding-syncing"
      || state?.firstSequence?.phase === "train-departing"
      || state?.firstSequence?.phase === "handoff-ready";
  }, null, { timeout });
}

async function waitForPeerGatedDeparture(page, timeout) {
  await page.waitForFunction(() => {
    const state = window.GoldRushHost?.getState?.();
    return state?.firstSequence?.peerHandoffGate?.ready === true
      && (state?.firstSequence?.phase === "train-departing" || state?.firstSequence?.phase === "handoff-ready");
  }, null, { timeout });
}

async function getHostState(page) {
  return page.evaluate(() => window.GoldRushHost?.getState?.() ?? null);
}

function summarizeState(state) {
  if (!state) return null;
  return {
    screen: state.screen,
    activeSite: state.sceneKitLoader?.activeSite?.id ?? state.activeSite?.id ?? null,
    party: {
      status: state.party?.status,
      role: state.party?.role,
      members: state.party?.members?.length ?? 0,
      roomCode: state.party?.roomCode ?? null,
      boarding: state.party?.boarding ? {
        contract: state.party.boarding.contract,
        expectedCount: state.party.boarding.expectedCount,
        readyCount: state.party.boarding.readyCount,
        allReady: state.party.boarding.allReady,
        missingMemberIds: state.party.boarding.missingMemberIds,
        disconnects: state.party.boarding.disconnects ?? [],
        ignoredReports: state.party.boarding.ignoredReports ?? [],
        reports: state.party.boarding.reports?.map((report) => ({
          memberId: report.memberId,
          status: report.status,
          phase: report.phase,
          localBoarded: report.localBoarded,
          kitAllReady: report.kitAllReady,
        })) ?? [],
      } : null,
    },
    firstSequence: {
      phase: state.firstSequence?.phase,
      playerLockedToTrain: state.firstSequence?.playerLockedToTrain,
      boardingStatus: state.firstSequence?.boardingStatus ? {
        contract: state.firstSequence.boardingStatus.contract,
        expectedCount: state.firstSequence.boardingStatus.expectedCount,
        boardedCount: state.firstSequence.boardingStatus.boardedCount,
        autoBoardedCount: state.firstSequence.boardingStatus.autoBoardedCount,
        localBoarded: state.firstSequence.boardingStatus.localBoarded,
        allReady: state.firstSequence.boardingStatus.allReady,
      } : null,
      peerHandoffGate: state.firstSequence?.peerHandoffGate ? {
        contract: state.firstSequence.peerHandoffGate.contract,
        required: state.firstSequence.peerHandoffGate.required,
        ready: state.firstSequence.peerHandoffGate.ready,
        rosterPolicy: state.firstSequence.peerHandoffGate.rosterPolicy,
        expectedCount: state.firstSequence.peerHandoffGate.expectedCount,
        readyCount: state.firstSequence.peerHandoffGate.readyCount,
        missingMemberIds: state.firstSequence.peerHandoffGate.missingMemberIds,
        disconnectedMemberIds: state.firstSequence.peerHandoffGate.disconnectedMemberIds,
      } : null,
    },
    loadingScene: {
      loadingPhase: state.loadingScene?.loadingPhase,
      doorOpen: state.loadingScene?.doorOpen,
      trainDeparting: state.loadingScene?.trainDeparting,
      playerLockedToTrain: state.loadingScene?.playerLockedToTrain,
    },
  };
}

function renderMarkdown(result) {
  const host = result.hostState;
  const member = result.memberState;
  return `# Peer Party Boarding Proof

Status: ${result.status}

URL: ${result.url}

## Steps

${result.steps.map((step) => `- ${step.status}: ${step.name} (${step.durationMs}ms)`).join("\n")}

## Host

- screen: ${host?.screen ?? "n/a"}
- party members: ${host?.party?.members ?? "n/a"}
- boarding: ${host?.party?.boarding?.readyCount ?? "n/a"}/${host?.party?.boarding?.expectedCount ?? "n/a"}
- train phase: ${host?.firstSequence?.phase ?? "n/a"}

## Member

- screen: ${member?.screen ?? "n/a"}
- party members: ${member?.party?.members ?? "n/a"}
- boarding: ${member?.party?.boarding?.readyCount ?? "n/a"}/${member?.party?.boarding?.expectedCount ?? "n/a"}
- train phase: ${member?.firstSequence?.phase ?? "n/a"}

## Error

${result.error?.message ?? "none"}
`;
}

function parseArgs(values) {
  const parsed = {};
  for (let index = 0; index < values.length; index += 1) {
    const value = values[index];
    if (!value.startsWith("--")) continue;
    const key = value.slice(2);
    const next = values[index + 1];
    if (!next || next.startsWith("--")) {
      parsed[key] = true;
    } else {
      parsed[key] = next;
      index += 1;
    }
  }
  return parsed;
}

function withProofParam(value) {
  const nextUrl = new URL(value);
  nextUrl.searchParams.set("publicSmoke", Date.now().toString(36));
  nextUrl.searchParams.set("peerPartyProof", "1");
  return nextUrl.toString();
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
