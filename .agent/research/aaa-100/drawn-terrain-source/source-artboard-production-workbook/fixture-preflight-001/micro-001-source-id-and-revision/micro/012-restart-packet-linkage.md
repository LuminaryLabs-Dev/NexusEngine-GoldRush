# 012 - Restart Packet Linkage

Status: planned docs-only
Parent atom: `001-source-id-and-revision`
Fixture id: `goldrush.desert.artboard.fixture.001`
Domain: production/restart

## Purpose

Make source identity implementation smaller and safer.

## Data Contract

restart packet fields and lesson-update trigger.

## Future Validator Case

source revision changes require restart packet fields before row status changes.

## Consumer Echo

The source fixture kit, validation kit, and at least one first consumer must expose the same fixture id and revision id before this micro-step is considered ready.

## Stop Condition

Stop if this micro-step can pass while new terrain knowledge is lost between planning and implementation passes.
