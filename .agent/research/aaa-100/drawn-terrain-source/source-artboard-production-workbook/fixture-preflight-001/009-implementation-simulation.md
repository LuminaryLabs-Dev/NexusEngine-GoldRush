# Implementation Simulation

Status: active docs-only
Fixture id: `goldrush.desert.artboard.fixture.001`

## Purpose

Dry-run the future implementation so the first coding pass knows where it is likely to fail.

## Simulated Implementation Sequence

1. Add the smallest fixture data shape.
   - Risk: it becomes too broad and delays all consumers.
   - Guard: include only one playable slice and one source revision.
2. Add a validator that fails before consumers are wired.
   - Risk: validator only checks existence.
   - Guard: include negative cases for missing layers, drift, and invalid masks.
3. Add query API wrapper.
   - Risk: old terrain utilities remain the real source.
   - Guard: queries must expose revision id and source cell id.
4. Render one near chunk from the fixture.
   - Risk: visual mesh looks correct but collider is separate.
   - Guard: render snapshot reports fixture id and LOD cell id.
5. Attach collider parity.
   - Risk: physics heightfield uses different simplification.
   - Guard: sample parity tests compare shared points.
6. Attach placement raycast.
   - Risk: props land by scatter instead of anchors.
   - Guard: each placed object reports anchor id and raycast hit.
7. Attach gameplay annotation read.
   - Risk: mining/cashout use existing hardcoded points.
   - Guard: gameplay marker snapshot reports annotation id.
8. Capture local and public human-view proof.
   - Risk: proof confirms nonblank output only.
   - Guard: screenshot expectations name readable objects and next action.

## Expected First Failure

The first likely failure is consumer drift: renderer can show the fixture while movement, collider, or gameplay still uses old terrain math. The validator should make that failure obvious.

## Stop Condition

Stop the future code pass if it cannot make one consumer honest before adding more terrain area or visual density.
