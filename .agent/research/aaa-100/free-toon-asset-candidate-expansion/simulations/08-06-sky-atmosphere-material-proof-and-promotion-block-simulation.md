# Sky Atmosphere Material - Proof And Promotion Block Simulation

Status: active docs-only
Domain: render / world / art
Target kit: n:goldrush:toon-atmosphere-protokits

## Purpose

Simulate what implementation would look like for proof and promotion block in the Sky Atmosphere Material candidate set.

## Simulated Implementation Path

1. Read the candidate set packet, atomic packet, paired research packet, and this simulation.
2. Verify the current source and license evidence for Poly Haven, Kenney, authored material work.
3. Create or update candidate metadata only after evidence is captured.
4. Keep `runtimePromotion: false` and block public runtime paths until review passes.
5. Bind the candidate to n:goldrush:toon-atmosphere-protokits before any renderer, scene, gameplay, or audio consumer can use it.
6. Run the narrow proof: first-viewport horizon and mobile proof.

## Expected First Failure

candidate is described as runtime content before local proof, public proof, and human approval exist.

## Expected Second Failure

The candidate may improve visual or audio quality but fail the gameplay meaning test. For this set, the player problem is: terrain and horizon need a coherent toon mood. If the candidate does not make that problem measurably clearer, implementation should stop.

## Expected Third Failure

A local proof may pass while public proof remains stale or missing. This is not acceptable for asset candidate work because missing deployed files, copied report paths, and stale Pages builds are common failure modes.

## Data To Capture

- candidate set id: sky-atmosphere-material
- gate id: proof-and-promotion-block
- target kit: n:goldrush:toon-atmosphere-protokits
- candidate source family: Poly Haven, Kenney, authored material work
- proof requirement: first-viewport horizon and mobile proof
- runtime promotion state: false

## Human-View Check

The player-facing proof must show the candidate improving the real game view, not only a model preview. For nonvisual audio atoms, the proof must show cue-state transition evidence and fallback parity.

## Stop Condition

Stop if implementation cannot satisfy source evidence, license evidence, kit ownership, style adaptation, local proof, public proof, and promotion blocking at the same time.
