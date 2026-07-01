# Default Sanitized Artifacts

Status: active

## Intention

GoldRush proof output should be safe to paste into chat, PRs, public reports, and GitHub Actions logs by default.

## Problem

Older retained reports used absolute local screenshot paths. That makes proof artifacts harder to share and exposes machine-specific context.

## Domain Web

```txt
proof harness
├─ writes raw screenshots internally
├─ writes sanitized JSON/Markdown externally
└─ prints sanitized console summaries

playtest doctor
├─ may probe local or external debug URLs
├─ prints sanitized JSON summaries
└─ must not leak alternate local URLs or machine paths into copied logs

report validation
├─ docs: token-like string scan
├─ reports: token-like + private path/profile scan
└─ manifests: token-like + private path/profile scan

debug artifacts
├─ output/
├─ .nexus-simulator/
└─ ignored unless reviewed and intentionally retained
```

## Kit Gaps

- `n:runtime:validation` should treat public artifact safety as a validation surface.
- `n:goldrush:reality-status` should keep reporting prototype/cloud-blocked features without raw local paths.
- Future live-test tooling should emit sanitized summaries by default and keep raw traces under ignored `output/`.

## Validator Implications

- `tools/safety/publicArtifactSanitizer.mjs` is the shared sanitizer.
- `tools/validation/validate-sanitized-artifact-boundaries.mjs` checks proof/simulator source code and selected playtest validation summaries so public output uses the shared sanitizer by default before artifacts are written or copied.
- `tools/validation/validate-report-secrets.mjs` is the retained-artifact safety gate.
- `tools/proof/public-deploy-smoke.mjs` now composes the sanitizer instead of carrying a local copy.
- `tools/validation/validate-live-playtest.mjs` now prints through `sanitizedConsoleJson` so the live-test doctor follows the same default output boundary.

## Acceptance

- Retained public smoke reports use repo-relative screenshot paths.
- Manifests use labels like `<documents>/...` instead of absolute ME paths.
- New proof scripts fail validation if they print raw JSON summaries or write retained reports without the sanitizer helpers.
- Live-test/playtest summary scripts fail validation if they print raw JSON summaries.
- The report validator fails future leaked home/temp/browser-profile paths in reports and manifests.
