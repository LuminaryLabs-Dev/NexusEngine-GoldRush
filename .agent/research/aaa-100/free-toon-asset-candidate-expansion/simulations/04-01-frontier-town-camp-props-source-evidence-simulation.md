# Frontier Town And Camp Props - Source Evidence Simulation

Status: active docs-only
Domain: content / world / combat
Target kit: n:goldrush:frontier-setpiece-protokits

## Purpose

Simulate what implementation would look like for source evidence in the Frontier Town And Camp Props candidate set.

## Simulated Implementation Path

1. Read the candidate set packet, atomic packet, paired research packet, and this simulation.
2. Verify the current source and license evidence for Kenney, Quaternius, KayKit.
3. Create or update candidate metadata only after evidence is captured.
4. Keep `runtimePromotion: false` and block public runtime paths until review passes.
5. Bind the candidate to n:goldrush:frontier-setpiece-protokits before any renderer, scene, gameplay, or audio consumer can use it.
6. Run the narrow proof: town shelf and camp route screenshots.

## Expected First Failure

candidate source is remembered, vague, or sourced from a mirror without creator proof.

## Expected Second Failure

The candidate may improve visual or audio quality but fail the gameplay meaning test. For this set, the player problem is: POIs lack readable western identity. If the candidate does not make that problem measurably clearer, implementation should stop.

## Expected Third Failure

A local proof may pass while public proof remains stale or missing. This is not acceptable for asset candidate work because missing deployed files, copied report paths, and stale Pages builds are common failure modes.

## Data To Capture

- candidate set id: frontier-town-camp-props
- gate id: source-evidence
- target kit: n:goldrush:frontier-setpiece-protokits
- candidate source family: Kenney, Quaternius, KayKit
- proof requirement: town shelf and camp route screenshots
- runtime promotion state: false

## Human-View Check

The player-facing proof must show the candidate improving the real game view, not only a model preview. For nonvisual audio atoms, the proof must show cue-state transition evidence and fallback parity.

## Stop Condition

Stop if implementation cannot satisfy source evidence, license evidence, kit ownership, style adaptation, local proof, public proof, and promotion blocking at the same time.
