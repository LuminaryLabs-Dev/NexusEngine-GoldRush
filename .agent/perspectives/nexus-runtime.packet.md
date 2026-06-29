# Nexus Runtime Packet

## Simulation Summary

A NexusRealtime systems reviewer expects every major game concept to be represented as a domain service kit with inspectable `engine.n.*` state.

## Expected Outcome

- Room orchestration, world layout, towns, paths, gold zones, mining, cargo, combat, perspective, scene transitions, audio state, and animation state are kit-owned.
- Renderer consumes descriptors only.
- Snapshot state is deterministic enough for validation.
- Every kit has a narrow API and a validation gate.

## Assumptions

- Some domain kits may start as wrappers over shared world descriptors.
- Splitting APIs is valuable if it creates clearer contracts for future assets and gameplay.
- Avoid over-abstracting until a validator or renderer surface consumes the contract.

## Failure Signs

- Renderer computes gameplay state.
- `goldrushWorld` becomes a dumping ground with no domain-specific APIs.
- Tests only prove install order, not behavior or edge cases.
- Phase transitions do not update audio/animation/camera descriptors.

## Evidence Needed

- `engine.n.goldrushTowns`, `goldrushPaths`, `goldrushGoldZones`, `goldrushAudio`, and `goldrushAnimation` snapshots.
- Validators for each new domain.
- Runtime proof after Mine -> Ambush -> Cash Out.

## Recommended Next Action

Split high-value world descriptors into dedicated NexusRealtime kit APIs while keeping `goldrushWorld` as the aggregate source.
