# 004 - Source Hash Inputs

Status: planned docs-only
Parent atom: `001-source-id-and-revision`
Fixture id: `goldrush.desert.artboard.fixture.001`
Domain: runtime/source

## Purpose

Make source identity implementation smaller and safer.

## Data Contract

stable hash inputs from source fields only.

## Future Validator Case

hash ignores derived render or physics output and changes when source fields change.

## Consumer Echo

The source fixture kit, validation kit, and at least one first consumer must expose the same fixture id and revision id before this micro-step is considered ready.

## Stop Condition

Stop if this micro-step can pass while revision identity is polluted by generated consumers or ignores source mutations.
