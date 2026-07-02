# Combat Cover Weapon Cues - Format Integrity Simulation

Status: active docs-only
Domain: combat / content / camera
Target kit: n:goldrush:combat-cover-protokits

## Purpose

Simulate what implementation would look like for format integrity in the Combat Cover Weapon Cues candidate set.

## Simulated Implementation Path

1. Read the candidate set packet, atomic packet, paired research packet, and this simulation.
2. Verify the current source and license evidence for Quaternius, Kenney.
3. Create or update candidate metadata only after evidence is captured.
4. Keep `runtimePromotion: false` and block public runtime paths until review passes.
5. Bind the candidate to n:goldrush:combat-cover-protokits before any renderer, scene, gameplay, or audio consumer can use it.
6. Run the narrow proof: cover route, threat line, and combat receipt proof.

## Expected First Failure

candidate exists but format, download shape, or conversion route is unclear.

## Expected Second Failure

The candidate may improve visual or audio quality but fail the gameplay meaning test. For this set, the player problem is: ambush pressure lacks readable cover and weapon silhouettes. If the candidate does not make that problem measurably clearer, implementation should stop.

## Expected Third Failure

A local proof may pass while public proof remains stale or missing. This is not acceptable for asset candidate work because missing deployed files, copied report paths, and stale Pages builds are common failure modes.

## Data To Capture

- candidate set id: combat-cover-weapon-cues
- gate id: format-integrity
- target kit: n:goldrush:combat-cover-protokits
- candidate source family: Quaternius, Kenney
- proof requirement: cover route, threat line, and combat receipt proof
- runtime promotion state: false

## Human-View Check

The player-facing proof must show the candidate improving the real game view, not only a model preview. For nonvisual audio atoms, the proof must show cue-state transition evidence and fallback parity.

## Stop Condition

Stop if implementation cannot satisfy source evidence, license evidence, kit ownership, style adaptation, local proof, public proof, and promotion blocking at the same time.
