# 003 - Revision Reason Taxonomy

Status: planned docs-only
Parent atom: `001-source-id-and-revision`
Fixture id: `goldrush.desert.artboard.fixture.001`
Domain: production/versioning

## Purpose

Make source identity implementation smaller and safer.

## Data Contract

revisionReason enum and short note.

## Future Validator Case

every revision explains whether source, mask, annotation, LOD, or proof changed.

## Consumer Echo

The source fixture kit, validation kit, and at least one first consumer must expose the same fixture id and revision id before this micro-step is considered ready.

## Stop Condition

Stop if this micro-step can pass while source changes happen without knowing which consumers became stale.
