# 009 - Source Summary Snapshot

Status: planned docs-only
Parent atom: `001-source-id-and-revision`
Fixture id: `goldrush.desert.artboard.fixture.001`
Domain: runtime/snapshot

## Purpose

Make source identity implementation smaller and safer.

## Data Contract

summary shape for fixture state.

## Future Validator Case

snapshot contains fixtureId, revisionId, reason, sourceHash, consumers, drift, and validation state.

## Consumer Echo

The source fixture kit, validation kit, and at least one first consumer must expose the same fixture id and revision id before this micro-step is considered ready.

## Stop Condition

Stop if this micro-step can pass while debug state cannot explain which source is live.
