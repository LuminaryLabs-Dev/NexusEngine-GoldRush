# Remaining Batch Receipt Contract

Status: raw-write gate
Validator: `node tools/validation/validate-remaining-batch-receipts.mjs`
Generator: `node tools/import-sanitize/generate-remaining-batch-receipts.mjs --write`

## Purpose

The first raw-copy gate is locked to the original 31-file plan. Remaining asset batches must not rewrite that gate or add files that make the first receipt set ambiguous. Each remaining batch gets its own receipt folder and an append-only index.

## Current Batch

```txt
batch: goldrush-dual-source-001.next.001.audio-music-and-sfx
domain: audio-music-and-sfx
items: 15
bytes: 90,145,108
mode: raw-files-written
raw files written: true
public promotion: false
runtime promotion: false
```

## Receipt Layout

```txt
reports/provenance/remaining-batches/
├─ batch-index.json
└─ goldrush-dual-source-001.next.001.audio-music-and-sfx/
   ├─ source.receipt.json
   ├─ raw-copy.receipt.json
   ├─ hashes.receipt.json
   ├─ secret-scan.receipt.json
   ├─ collision-and-overlap.receipt.json
   └─ validator.receipt.json
```

Every receipt must include:

```txt
receiptKind: remaining-batch
importJobId: goldrush-dual-source-001
batchId: goldrush-dual-source-001.next.001.audio-music-and-sfx
doesNotModifyFirst31Gate: true
```

## Acceptance Rules

- The first 31-file cloud asset receipt gate remains unchanged.
- The remaining batch receipt index is append-only.
- The batch id is unique and stable.
- The batch is exactly 15 files and 90,145,108 bytes.
- Every source file is fetched by immutable GitHub blob SHA.
- Every target path stays inside `raw/imported/goldrush-dual-source-001/`.
- No target path overlaps the first 31-file raw-copy plan.
- No case-insensitive target collisions exist.
- The batch is audio-only: `.ogg`, `.mp3`, `.wav`.
- Secret scan reports 0 findings.
- Receipts contain no runtime paths and no approval claims.
- Written raw files must match the receipt byte counts and SHA-256 hashes.

## Promotion Rules

Passing this gate proves the raw audio files are copied and hash-backed. It does not approve runtime assets. Public/runtime promotion still requires:

```txt
raw copy receipts
sanitized conversion
license provenance
human review
approved runtime asset record
public/assets file hash match
```

Any missing provenance, hash mismatch, secret finding, unsafe path, unclear license, missing human review, or direct raw-to-runtime promotion blocks promotion.
