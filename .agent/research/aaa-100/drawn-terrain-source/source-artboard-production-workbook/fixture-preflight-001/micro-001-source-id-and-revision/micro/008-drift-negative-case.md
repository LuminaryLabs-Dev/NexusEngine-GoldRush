# 008 - Drift Negative Case

Status: planned docs-only
Parent atom: `001-source-id-and-revision`
Fixture id: `goldrush.desert.artboard.fixture.001`
Domain: validation

## Purpose

Make source identity implementation smaller and safer.

## Data Contract

consumer fixture or revision mismatch failure cases.

## Future Validator Case

validator fails when any consumer echoes a mismatched id or revision.

## Consumer Echo

The source fixture kit, validation kit, and at least one first consumer must expose the same fixture id and revision id before this micro-step is considered ready.

## Stop Condition

Stop if this micro-step can pass while source drift is discovered only from visual bugs.
