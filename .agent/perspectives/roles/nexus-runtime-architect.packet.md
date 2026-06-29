# Nexus Runtime Architect Packet

## Simulation Summary

A Nexus runtime architect will prefer many small, inspectable domain APIs over one broad world blob.

## Expected Outcome

- `engine.n.goldrushWorld` remains aggregate context.
- Dedicated APIs own domains:
  - `goldrushTowns`
  - `goldrushPaths`
  - `goldrushGoldZones`
  - `goldrushAudio`
  - `goldrushAnimation`
- Scenario snapshots compose these APIs.
- Validators prove both install order and behavior.

## Failure Signs

- Renderer or app code computes gameplay.
- Domain-specific state only exists in docs.
- Kit APIs expose unstable shapes or raw asset paths.
- Audio/animation/camera states do not follow phase and combat transitions.

## Evidence Needed

- Runtime validator requiring each API.
- Snapshot proof after 51 and 72 player generation.
- Interaction proof after Mine -> Ambush -> Cash Out.

## Recommended Next Action

Split the world descriptors into dedicated APIs now, while keeping the implementation backed by local placeholder descriptors.
