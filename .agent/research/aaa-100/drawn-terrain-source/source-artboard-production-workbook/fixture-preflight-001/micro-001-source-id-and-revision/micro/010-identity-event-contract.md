# 010 - Identity Event Contract

Status: planned docs-only
Parent atom: `001-source-id-and-revision`
Fixture id: `goldrush.desert.artboard.fixture.001`
Domain: runtime/events

## Purpose

Make source identity implementation smaller and safer.

## Data Contract

loaded, rejected, changed, consumerReady, consumerDrift events.

## Future Validator Case

events carry fixtureId, revisionId, and consumer id when relevant.

## Consumer Echo

The source fixture kit, validation kit, and at least one first consumer must expose the same fixture id and revision id before this micro-step is considered ready.

## Stop Condition

Stop if this micro-step can pass while state changes happen without a replayable event trail.
