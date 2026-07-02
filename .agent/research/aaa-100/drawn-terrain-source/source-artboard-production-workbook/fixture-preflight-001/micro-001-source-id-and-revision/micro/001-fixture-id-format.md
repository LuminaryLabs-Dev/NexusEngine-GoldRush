# 001 - Fixture Id Format

Status: planned docs-only
Parent atom: `001-source-id-and-revision`
Fixture id: `goldrush.desert.artboard.fixture.001`
Domain: runtime/source

## Purpose

Make source identity implementation smaller and safer.

## Data Contract

fixtureId exact string and namespace pattern.

## Future Validator Case

validator rejects ids outside goldrush.desert.artboard.fixture.*.

## Consumer Echo

The source fixture kit, validation kit, and at least one first consumer must expose the same fixture id and revision id before this micro-step is considered ready.

## Stop Condition

Stop if this micro-step can pass while fixture identity becomes a loose label instead of a stable source contract.
