# Proof Shot List Data Implementation Simulation

Status: active docs-only
Atom: 09-02

## Simulated Implementation

A future code pass adds the proof-shot-list / data sheet to a tiny terrain source fixture. The first test passes because the source fixture loads, but the pass risks plateauing if only one consumer reads the new sheet.

## Expected Drift

- Renderer may use the source while collider still samples old terrain math.
- Collider may use the source while object placement still uses local constants.
- Object placement may use the source while route, gold, cover, or cashout kits ignore annotations.
- Local proof may name the source while public proof remains stale.

## Recovery Gate

Shrink the change until one source revision is visible in the source snapshot, consumer snapshot, validator output, and human-view proof.

## Success Signal

The atom succeeds when it prevents an attractive screenshot from masking source-consumer drift.
