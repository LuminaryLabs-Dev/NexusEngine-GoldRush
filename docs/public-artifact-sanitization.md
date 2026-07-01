# Public Artifact Sanitization

GoldRush is a public repo, so retained proof artifacts are sanitized by default.

## Default Lane

```txt
proof, playtest, agent packet, or report writer
-> tools/safety/publicArtifactSanitizer.mjs
-> repo-relative or labeled paths
-> retained reports/manifests/output JSON
-> tools/validation/validate-report-secrets.mjs
```

## Public-Safe Values

- Repo files: `reports/public-smoke/example.json`
- GitHub sibling paths: `<github>/NexusSimulator/NexusSimulator-V1`
- Documents paths: `<documents>/Me/GoldRush/.agent/goal.md`
- Temp captures: `<tmp>/capture.png`
- File URLs: converted to repo-relative or labeled paths before output
- Tokens, keys, cookies, and browser profiles: redacted labels only
- Standalone account emails: `<account-email>`
- URL query secrets: query value redacted, non-secret query keys preserved

## Not Public-Safe

- Absolute home paths.
- macOS temp folders.
- Chrome profile paths or account identifiers.
- Standalone account emails from browser profiles or test accounts.
- URL query strings with `token`, `key`, `secret`, `password`, `access_token`, `refresh_token`, `id_token`, `client_secret`, or `api_key` values.
- Secret-like values.
- Raw Playwright traces or videos unless reviewed and intentionally retained.

## Required Gate

Run:

```bash
npm run sanitize
node tools/validation/validate-sanitized-artifact-boundaries.mjs
node tools/validation/validate-report-secrets.mjs
node tools/validation/validate-public-build-artifacts.mjs
```

The boundary validator checks proof, simulator, and selected playtest validation tools before they write or print shareable artifacts. It also discovers every script under `tools/import-sanitize/` and fails raw JSON console summaries, raw retained JSON writes, and JSON-buffer outputs that bypass the shared sanitizer.

The report-secret validator scans `.agent`, docs, reports, manifests, and `output/` text artifacts for token-like strings, private path leaks, temp path leaks, browser-profile details, account emails, and secret-like query values. These folders are treated as shareable/public artifact roots by default because their contents are routinely copied into chat, PRs, workflow logs, and release notes.

`npm run build` is sanitizer-gated by default: `prebuild` runs `npm run sanitize`, Vite writes `dist/`, and `postbuild` runs `validate-public-build-artifacts.mjs` against the emitted static site. The build-output validator fails copied source-only folders, local machine paths, raw import paths, quarantine paths, sanitized review registry paths, `public/assets/...` runtime path mistakes, file URLs, and traversal references. The deploy workflow uses `npm run check`, so the same default applies before GitHub Pages upload.

## Tool Contract

Any new proof, simulator, GPT-it, or live-test reporter should use:

```js
import {
  sanitizedConsoleJson,
  writeSanitizedJsonArtifact,
  writeSanitizedJsonArtifactSync,
  writeSanitizedTextArtifact,
  writeSanitizedTextArtifactSync,
} from "../safety/publicArtifactSanitizer.mjs";
```

The async writers are preferred for Playwright/proof tooling. The sync writers exist for CLI import/sanitize scripts that already use synchronous filesystem operations. The writer may keep absolute paths for internal filesystem writes, but persisted JSON/Markdown and console summaries should use these helpers so sanitization is the default write boundary.
Simulator/proof tooling should not carry local sanitizer copies; all public-facing output should compose this shared module so path labels, file URL handling, profile/account redaction, and token redaction stay consistent.

## Static Boundary Rule

Proof scripts under `tools/proof/` must:

- import `tools/safety/publicArtifactSanitizer.mjs`.
- write retained JSON through `writeSanitizedJsonArtifact`.
- print summaries through `sanitizedConsoleJson`.
- sanitize screenshot paths before storing them in reports.
- avoid raw `writeFileSync` and raw `console.log(JSON.stringify(...))`.

Simulator scripts under `tools/simulator/` may write ignored `.nexus-simulator/` env and scenario state with raw filesystem paths, but all returned paths, errors, and command JSON must be sanitized before they are printed.

Playtest validation scripts that print shareable JSON summaries, starting with `tools/validation/validate-live-playtest.mjs`, must import the shared sanitizer and print through `sanitizedConsoleJson`. This keeps local debug URLs, alternate external URLs, and future artifact paths safe before they enter chat, PRs, or copied logs.

Active import/sanitize scripts under `tools/import-sanitize/` that write retained proof, receipt, review, provenance, conversion, registry, or queue JSON must use `writeSanitizedJsonArtifactSync` and print JSON summaries with `sanitizedConsoleJson`. The static gate now discovers the whole import-sanitize folder instead of checking a hand-maintained file list.

Raw asset bytes are still written directly to `raw/imported/<jobId>/` because they are the quarantined source evidence. Sanitized binary review copies can also be written as bytes under `sanitized/converted/`. Any `.json` generated by those byte writers must route through the sanitizer at the write boundary. The sanitizer boundary applies to retained JSON, Markdown, console summaries, reports, manifests, registries, review queues, and proof artifacts.
