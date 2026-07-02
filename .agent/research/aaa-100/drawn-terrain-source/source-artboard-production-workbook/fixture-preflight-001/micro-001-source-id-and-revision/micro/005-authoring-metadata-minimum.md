# 005 - Authoring Metadata Minimum

Status: planned docs-only
Parent atom: `001-source-id-and-revision`
Fixture id: `goldrush.desert.artboard.fixture.001`
Domain: world/production

## Purpose

Make source identity implementation smaller and safer.

## Data Contract

authoring note, source family, intended slice, no private path fields.

## Future Validator Case

metadata is useful for restart but safe for public reports.

## Consumer Echo

The source fixture kit, validation kit, and at least one first consumer must expose the same fixture id and revision id before this micro-step is considered ready.

## Stop Condition

Stop if this micro-step can pass while debugging needs context but reports leak irrelevant local details.
