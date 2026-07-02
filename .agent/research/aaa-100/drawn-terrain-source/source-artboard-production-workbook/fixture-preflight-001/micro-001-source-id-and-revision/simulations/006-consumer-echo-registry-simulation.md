# 006 - Consumer Echo Registry Simulation

Status: active docs-only
Parent atom: `001-source-id-and-revision`

## Simulated Implementation

1. Add the minimum source field for expected consumer ids and echo fields.
2. Add the negative validator case.
3. Expose the value in the source fixture snapshot.
4. Require one consumer echo.
5. Prove render, collider, movement, placement, gameplay, proof list fixtureId and revisionId.
6. Mark proof stale if source revision changes.

## Likely Failure

one consumer can silently stay on old terrain math.

## Recovery

- Stop downstream consumer expansion.
- Fix source identity first.
- Add a failing case before a passing case.
- Re-run local and public proof only after the snapshot reports the correct identity.
