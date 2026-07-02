# 007 - Missing Identity Negative Case

Status: planned docs-only
Parent atom: `001-source-id-and-revision`
Fixture id: `goldrush.desert.artboard.fixture.001`
Domain: validation

## Purpose

Make source identity implementation smaller and safer.

## Data Contract

fixture missing id or revision failure cases.

## Future Validator Case

validator fails missing fixtureId or missing revisionId before any consumer runs.

## Consumer Echo

The source fixture kit, validation kit, and at least one first consumer must expose the same fixture id and revision id before this micro-step is considered ready.

## Stop Condition

Stop if this micro-step can pass while bad source can enter runtime before the first gate.
