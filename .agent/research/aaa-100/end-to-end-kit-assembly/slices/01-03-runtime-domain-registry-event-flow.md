# Runtime Domain Registry - Event Flow

Status: planned docs-only
Slice: 01 Runtime Domain Registry
Domain: runtime/architecture
Scene/site: all-sites
Generic kit: n:runtime:domain-registry
GoldRush kit: n:goldrush:runtime

## Purpose

Define the upstream facts, downstream subscribers, failure events, and restart behavior for the slice.

## Slice Intention

Make every game system discoverable, ordered, resettable, snapshot-capable, and owned by one domain.

## Atomic Substeps

1. Confirm this slice is owned by `n:goldrush:runtime` and not by renderer-only logic.
2. Confirm the generic kit dependency remains neutral and promotable when applicable.
3. Define the smallest public API command or query the next slice needs.
4. Define the private work the kit may do behind the API.
5. Define the event payload emitted when the slice changes.
6. Define the serializable snapshot for browser and simulator proof.
7. Define reset behavior for scene changes, match restart, and failed proof.
8. Define the main negative fixture or fakeout case.
9. Define one human-view acceptance check when the slice is player-facing.
10. Define the next slice that consumes this output.

## Event And Snapshot

- Event: `runtime.kit.registry.changed`
- Snapshot: `runtimeDomainRegistry`
- Reset rule: clear transient scene state, retain durable receipts only when the match lifecycle owns them.

## Validator Seed

`validate-domain-kit-contracts`

## Human-View Proof Seed

state snapshot shows every active kit with owner, dependencies, events, reset, and validation status

## Known Fakeout

A kit file exists but no runtime registry, lifecycle, or proof knows it exists.

## Implementation Boundary

This is docs-only. Runtime code changes, new local kits, asset movement, deployment, and proof execution are deferred until implementation mode resumes.

