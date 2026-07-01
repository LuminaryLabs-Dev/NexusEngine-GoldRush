# Proof And Deploy Loop Goal

Status: active

## Purpose

Define how local work becomes trustworthy public evidence.

## Deploy Contract

- `Build` branch deploys GitHub Pages.
- `.github/workflows/deploy-build.yml` owns the Build-branch deployment.
- Public link: `https://luminarylabs-dev.github.io/NexusEngine-GoldRush/`

## Proof Contract

- Use validators for kit contracts, runtime state, asset gates, import boundaries, and build output.
- Use Playwright screenshots for local/public human-view comparison.
- Use video only for motion-sensitive issues.
- Use browser doctor before long proof runs if Playwright/Chrome control has recently hung.
- Keep retained proof under `reports/` and `screenshots/`.
- Keep scratch captures ignored.

## Regular Audit Path

```txt
npm run validate
npm run build
npm run proof:browser-doctor -- --recordVideo=false --timeout 10000 --hardTimeout 45000
npm run proof:live-state-audit -- --target both --recordVideo=false --hardTimeout 180000
```

## Evidence Standard

A green test only proves what it covers. Before claiming a broad goal, inspect whether the validator or proof actually covers the requested behavior.
