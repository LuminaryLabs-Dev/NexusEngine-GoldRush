# Sanitized Default Import Boundary

Date: 2026-06-30

## Domain

Content import, public artifact safety, asset promotion.

## Sources

- OWASP File Upload Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html
- GitHub secret scanning docs: https://docs.github.com/en/code-security/concepts/secret-security/secret-scanning
- Khronos glTF 2.0 URI rules: https://registry.khronos.org/glTF/specs/2.0/glTF-2.0.html#uris

## Relevant Guidance

- OWASP recommends allowed extensions, file type validation, filename safety, size limits, sandbox/AV-style validation where available, and storage outside the public webroot when possible.
- GitHub secret scanning is designed to catch hardcoded credentials across repository history, but GoldRush should still sanitize before artifacts are written.
- glTF uses URI references for buffers and images; relative resource paths are the portable baseline, while absolute paths, schemes, query strings, and fragments are less portable and should not be runtime asset defaults.

## GoldRush Interpretation

```txt
raw/imported/<jobId>/
  quarantined source evidence only

sanitized/converted/<jobId>/
  reviewable converted candidates only

public/assets/
  approved runtime assets only

reports/ manifests/ output/
  public-safe retained evidence only
```

## Current Implementation

- `tools/safety/publicArtifactSanitizer.mjs` owns path, account, profile, token, query-secret, file URL, and text redaction.
- `writeSanitizedJsonArtifactSync` and `writeSanitizedTextArtifactSync` make synchronous CLI tools use the same write boundary as Playwright/proof tooling.
- `tools/import-sanitize/copy-remaining-batch-from-github.mjs` now prints sanitized summaries and writes retained proof JSON through the shared sync writer.
- `tools/import-sanitize/generate-remaining-batch-receipts.mjs` now prints sanitized summaries and writes receipt/index JSON through the shared sync writer.
- `tools/validation/validate-sanitized-artifact-boundaries.mjs` now explicitly checks the active remaining-batch import tools as well as proof and simulator tools.

## Remaining Gaps

- Older import/sanitize scripts still use local `writeJson` helpers. They are covered by `validate-report-secrets.mjs` after output, but they are not all statically forced through the sanitizer yet.
- Sanitized image/texture review conversion for `goldrush-dual-source-001.next.003.mine-town-terrain-props` is still missing.
- Runtime asset promotion still needs license provenance, human approval ids, output hashes, approved records, and `public/assets/` copies.

## Next GoldRush Action

Convert batch 003 into sanitized texture/material review outputs without public/runtime promotion. Then migrate the remaining import/sanitize writers to the shared sync writer in small groups so sanitizer-by-default becomes universal, not just validated after the fact.
