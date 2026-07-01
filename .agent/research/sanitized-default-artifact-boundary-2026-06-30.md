# Sanitized Default Artifact Boundary Research

Status: active
Date: 2026-06-30

## Question

How should GoldRush keep public proof, import, and review artifacts sanitized by default while still allowing raw legacy evidence to be copied into guarded folders?

## Source Notes

- OWASP Logging Cheat Sheet: application logging should be consistent and security/operationally useful, which maps to using one shared sanitizer boundary instead of per-script ad hoc redaction.
- OWASP Secrets Management Cheat Sheet: secrets are often scattered through source/config/tooling, so public artifacts should treat credentials, tokens, browser profiles, and machine paths as deny-by-default output data.
- OWASP Secure Code Review Cheat Sheet: secure review expects no hardcoded secrets, graceful errors without information disclosure, and sensitive data kept out of logs.

Sources:

- https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html
- https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html
- https://cheatsheetseries.owasp.org/cheatsheets/Secure_Code_Review_Cheat_Sheet.html

## GoldRush Decision

Use a single public artifact sanitizer as the default write boundary:

```txt
tool output
-> tools/safety/publicArtifactSanitizer.mjs
-> retained JSON/Markdown/console summary
-> validate-sanitized-artifact-boundaries
-> validate-report-secrets
```

## Scope

Enforced:

- `.agent/` packets and research notes
- `docs/` documentation packets
- `tools/proof/`
- `tools/simulator/`
- every `.mjs`/`.js` script under `tools/import-sanitize/`
- retained JSON reports, receipts, registries, review packets, provenance packets, queues, and console summaries

Allowed direct byte writes:

- raw legacy bytes under `raw/imported/<jobId>/`
- sanitized binary review copies under `sanitized/converted/`

Blocked by the gate:

- raw `console.log(JSON.stringify(...))`
- raw `console.error(JSON.stringify(...))`
- raw retained `writeFileSync(... JSON.stringify(...))`
- `process.stdout.write(serialized)` JSON reports
- JSON buffers written by byte helpers without a `.json` sanitizer branch

## AAA/Production Gap

This is not a player-visible feature, but it is production hygiene for a public asset-heavy game repo. The next gap is approval automation: after human/license review, promotion into `public/assets/` needs a similarly strict promotion writer that creates approved runtime records and hash-proves public bytes without allowing sanitized review candidates to become runtime assets accidentally.

## Follow-Up: Strict Agent/Docs Scope

Agent packets and docs are now treated as public/shareable artifact roots, not only internal notes. This means future retained Markdown, YAML, CSV, and JSON under `.agent/` and `docs/` must avoid absolute home paths, temp paths, browser-profile strings, standalone account emails, token-like values, and secret query values. Internal writes may still use absolute filesystem paths, but any persisted shareable packet should use repo-relative paths or labels such as `<github>/...`, `<documents>/...`, `<tmp>/...`, and `<path>/...`.
