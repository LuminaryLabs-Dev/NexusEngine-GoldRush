# 006 - Consumer Echo Registry

Status: planned docs-only
Parent atom: `001-source-id-and-revision`
Fixture id: `goldrush.desert.artboard.fixture.001`
Domain: runtime/snapshot

## Purpose

Make source identity implementation smaller and safer.

## Data Contract

expected consumer ids and echo fields.

## Future Validator Case

render, collider, movement, placement, gameplay, proof list fixtureId and revisionId.

## Consumer Echo

The source fixture kit, validation kit, and at least one first consumer must expose the same fixture id and revision id before this micro-step is considered ready.

## Stop Condition

Stop if this micro-step can pass while one consumer can silently stay on old terrain math.
