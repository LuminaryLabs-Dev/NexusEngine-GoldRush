# Approved Runtime Promotion Gate Research

Status: active
Date: 2026-06-30

## Question

How should GoldRush move reviewed legacy assets from sanitized review outputs into public browser runtime assets without making raw, pending, or unsafe files playable?

## Source Notes

- OWASP File Upload guidance recommends allow-listing only needed file extensions, validating type/signature/content, constraining filenames, setting size limits, using controlled storage locations, and treating publicly retrievable files as higher risk.
- OWASP File Upload guidance also notes public retrieval can disclose content or host illegal/copyrighted/malicious material, which maps to GoldRush requiring license provenance and human approval before `public/assets`.
- OWASP Logging guidance supports consistent event/report handling, which maps to retained promotion reports going through the shared sanitizer instead of raw script output.

Sources:

- https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html
- https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html

## GoldRush Decision

Promotion is separate from sanitation:

```txt
raw/imported
-> sanitized/converted
-> reports/human-review + reports/license-provenance
-> explicit approval id
-> promote-approved-runtime-assets dry run
-> public/assets/goldrush-approved only with explicit write confirmation
```

## Enforced Now

- No approval inference from source path, filename, conversion success, or review queue priority.
- Human review and license provenance must both be approved.
- Approval IDs must be present and must match.
- Runtime files must use generated `assets/goldrush-approved/...` paths.
- Metadata, external-conversion requests, and review-only descriptors are blocked from runtime promotion.
- The planner currently reports 0 approved records and 768 blocked items.

## AAA/Production Gap

The next production gap is authoring the actual approval records after human/license review. Once a small audio or texture set is explicitly approved, run the planner in write mode, validate the public manifest and approved registry, then smoke-test the public build so the runtime proves it uses approved assets instead of placeholders.
