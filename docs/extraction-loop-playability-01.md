# Extraction Loop Playability 01

## Purpose

This pass turns the gold-field runtime into a local playable slice:

```txt
spawn
-> walk over shoulder
-> hold E near a gold seam
-> carry gold
-> walk to extraction
-> hold E to cash out
-> receive extraction receipt and score
```

## Runtime Ownership

- `engine.n.goldrushExtractionLoop` owns local run phase, player cargo view, mining progress, combat pressure, readable local threat lanes, extraction progress, and the final loop receipt.
- Existing kits still own their domains:
  - `engine.n.goldrushCargo` owns carried gold.
  - `engine.n.goldrushCashout` owns deposits.
  - `engine.n.goldrushExtractionReceipts` owns accepted/duplicate receipt records.
  - `engine.n.goldrushScoring` owns score application.
  - `engine.n.goldrushReplaySummary` receives loop events.
- Three.js only renders `extractionLoop.worldSpaceMarkers`; it does not decide mining, payout, cashout, or receipt validity.

## Controls

- `WASD`: move relative to camera yaw.
- `E`: hold to mine when near a seam, or hold to cash out when near extraction.
- Right mouse: closer aim/combat posture.
- Left mouse: fire at active local threat pressure.

## Validation

```bash
node tools/validation/validate-goldrush-extraction-loop.mjs
npm run check
```

The validator proves:

- the extraction-loop API exists under `engine.n`.
- mining sites, extraction sites, threat spawns, and world-space markers exist.
- mining cannot pay out unless the player is in range and the hold timer completes.
- mining exposes `goldrush-mining-claim-pressure-v1` with site quality, reward preview, noise radius, claim heat, next risk, and mining receipts.
- local threats expose deterministic telegraphs, multisensory cues, danger lanes, counterplay tags, and combat receipts.
- extraction cannot complete outside the extraction volume.
- extraction creates an idempotent receipt with `runId`, `cargoValue`, `durationTicks`, `nextSceneId`, and `roomHandoffId`.
- scoring receives the accepted extraction receipt.

## Browser Proof

- Report: `reports/goldrush-extraction-loop-01.json`
- Summary: `reports/goldrush-extraction-loop-01.md`
- Screenshot: `screenshots/goldrush-extraction-loop-01.png`

The browser proof used the local dev server and installed Chrome. It walked through title, lobby, loading-yard train handoff, gold field, mine interaction, extraction interaction, and receipt creation.

## Mining Claim Pressure Follow-Up

Mining now exposes a first-class `n:goldrush:mine-hold-action` readability contract:

```txt
mine marker
-> reward preview
-> hold progress
-> claim heat/noise radius
-> mining receipt
-> next risk preview
```

This keeps the risk/reward of working a gold claim in the extraction-loop kit. The renderer can present dust, glints, sound, and claim-jumper warning cues from `extractionLoop.mining.readability` and `worldSpaceMarkers[*].mining`, but it does not calculate payout, heat, depletion, or receipt history.

## Contested Extraction Follow-Up

The cashout site now evaluates condition-linked contest pressure during `holdExtraction()`. High-risk runs can escalate an extraction marker through `watched`, `contested`, and `lockdown`; call linked threats; and preserve `extractionSiteContest` on the accepted receipt. Current proof lives at `output/playwright/contested-extraction-sites-proof.json`.

Final-rush pressure now reaches the playable extraction loop instead of only the match lifecycle. Mining sites carry real `goldZoneId`/`roomWindowId` links, the loop exposes `goldrush-final-rush-extraction-pressure-v1`, extraction contests store that pressure context, and accepted receipts preserve the real gold-zone id so `n:goldrush:final-rush` multipliers apply to scoring.

## Readable Threat Follow-Up

Threat markers now carry `telegraph`, `lane`, and `cue` metadata from the extraction-loop kit:

```txt
threat activated
-> telegraph phase
-> danger lane
-> player shot or damage receipt
-> replay-safe combat receipt
```

This gives the renderer a game-owned contract for drawing ambush readability without making Three.js decide combat rules.

The audio manager also consumes the same readable-threat contract. When a threat telegraph becomes readable before damage, it creates a deduped one-shot under `readable-threat-audio-cues-v1` and maps the current placeholder threat cue to `goldrush.audio.sfx.ambush`. This keeps combat readability multisensory while actual legacy SFX remain blocked until approved audio promotion.

The ambush-pressure kit also exposes `readable-threat-cover-v1`. Each readable threat owns deterministic cover descriptors with `cover.*` ids, lane id, world position, exposure, lane-blocking status, recommended cover id, peek side, and camera shoulder. The renderer presents these as cover markers, but the renderer does not choose cover or score exposure.

Cover is now actionable through `goldrush-cover-engagement-v1`. The extraction-loop kit owns engaged/peeking state, selected cover id, lane id, peek side, camera shoulder, exposure, damage reduction, and cover receipts. The host can hold cover with Q or call `engageCover`, but the kit chooses and scores the cover.

Results and replay now consume the same combat receipts. `goldrushResults` exposes `combatOutcomeSummary` with receipt count, damage, base damage pressure, mitigated damage, cover ids, threat lanes, telegraph IDs, and under-fire awards; `goldrushReplaySummary` adds combat and cover moments beside extraction and handoff moments.

The runtime also consumes the same threat contract for camera state. Active readable threats, aim, fire, or damage switch the NexusRealtime perspective/camera kits into combat, and defeating the active threat returns the camera, animation posture, and scene intent to exploration. Background frontier danger can still keep music tense, but it is not enough by itself to lock the camera in combat.

Browser proof:

```bash
npm run proof:threat-lanes -- --url http://127.0.0.1:5177/NexusEngine-GoldRush/
npm run proof:combat-results -- --url http://127.0.0.1:5177/NexusEngine-GoldRush/
```

The proof enters the run scene, activates the claim-jumper threat, verifies `readable-threat-lanes-v1`, confirms the `lane.claim-jumper-01` mesh exists, and captures a screenshot under `output/playwright/threat-lane-render-proof/`.
It also verifies `readable-threat-cover-v1` and the recommended `cover.claim-jumper-01.*` mesh so the visible counterplay surface stays tied to kit-owned combat state.
It also verifies engaged cover ids so a selected cover marker stays tied to `goldrush-cover-engagement-v1`, not renderer-only highlighting.

The combat-results proof forces shot and damage receipts before extraction, enters the results scene, and verifies the visible result UI shows the Combat field, under-fire award, replay lane ID, and `goldrush-combat-outcome-summary-v1` state.

## Still Prototype Or Blocked

- Character rig and authored animation clips remain prototype.
- Combat AI, authored VFX, hit reactions, and weapon feel remain prototype.
- Mining/cashout visuals are procedural markers, not legacy-authored props.
- Legacy Unity models, textures, prefabs, audio, SFX, and authored animation clips remain blocked on cloud-side import and approval.
- The visual terrain still needs a separate human-view pass for remaining blue/debug-looking gaps.
