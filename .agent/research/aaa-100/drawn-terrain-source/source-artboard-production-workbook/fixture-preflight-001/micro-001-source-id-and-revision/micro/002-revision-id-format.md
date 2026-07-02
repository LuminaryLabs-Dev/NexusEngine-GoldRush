# 002 - Revision Id Format

Status: planned docs-only
Parent atom: `001-source-id-and-revision`
Fixture id: `goldrush.desert.artboard.fixture.001`
Domain: runtime/versioning

## Purpose

Make source identity implementation smaller and safer.

## Data Contract

revisionId deterministic short id.

## Future Validator Case

validator rejects empty, random, or non-repeatable revision ids.

## Consumer Echo

The source fixture kit, validation kit, and at least one first consumer must expose the same fixture id and revision id before this micro-step is considered ready.

## Stop Condition

Stop if this micro-step can pass while revisions cannot be compared between local and public proof.
