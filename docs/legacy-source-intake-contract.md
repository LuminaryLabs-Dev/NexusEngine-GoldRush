# Legacy Source Intake Contract

## Purpose

The legacy source intake bridge makes the destination repo ready for cloud-side asset transfer from both old Gold Rush Unity projects without cloning or copying those projects locally.

## Runtime API

`engine.n.goldrushLegacySources`

Services:

- `snapshot()`: returns the browser-safe legacy source manifest.
- `readiness()`: compares required playable asset families against approved runtime slots.
- `importRequest({ importJobId })`: returns the cloud worker intake packet shape.
- `validate()`: checks that both legacy source projects, import stages, and playable families are represented.

## Import Manifest

The concrete cloud-worker request lives at:

```txt
manifests/import-jobs/goldrush-legacy-source-intake.json
```

It defines:

- both source project keys.
- required legacy scene candidates.
- candidate asset families.
- required report outputs.
- promotion slots required for playable parity.
- destination folder rules for raw, scanned, converted, reviewed, and promoted assets.

## Local Boundary

Local Codex work may validate the destination repo, but must not clone the source repositories. Raw files remain blocked until a private cloud worker performs deny-path scanning, secret scanning, hash manifest generation, conversion, license/provenance review, and human approval.

## Browser Proof

`window.GoldRushHost.getState()` now exposes:

```txt
legacySources
legacyReadiness
```

The HUD shows:

```txt
legacy sources: 2
asset readiness: 0/19
```

The readiness count should remain incomplete until approved runtime assets replace placeholder slots.

