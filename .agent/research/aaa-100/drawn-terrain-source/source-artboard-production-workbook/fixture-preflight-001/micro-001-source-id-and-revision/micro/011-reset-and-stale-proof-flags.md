# 011 - Reset And Stale Proof Flags

Status: planned docs-only
Parent atom: `001-source-id-and-revision`
Fixture id: `goldrush.desert.artboard.fixture.001`
Domain: runtime/proof

## Purpose

Make source identity implementation smaller and safer.

## Data Contract

reset behavior and stale proof flags.

## Future Validator Case

revision changes mark render, collider, placement, gameplay, local proof, and public proof stale.

## Consumer Echo

The source fixture kit, validation kit, and at least one first consumer must expose the same fixture id and revision id before this micro-step is considered ready.

## Stop Condition

Stop if this micro-step can pass while old proof is reused after source changes.
