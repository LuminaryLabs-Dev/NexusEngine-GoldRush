# 004 - Source Hash Inputs Simulation

Status: active docs-only
Parent atom: `001-source-id-and-revision`

## Simulated Implementation

1. Add the minimum source field for stable hash inputs from source fields only.
2. Add the negative validator case.
3. Expose the value in the source fixture snapshot.
4. Require one consumer echo.
5. Prove hash ignores derived render or physics output and changes when source fields change.
6. Mark proof stale if source revision changes.

## Likely Failure

revision identity is polluted by generated consumers or ignores source mutations.

## Recovery

- Stop downstream consumer expansion.
- Fix source identity first.
- Add a failing case before a passing case.
- Re-run local and public proof only after the snapshot reports the correct identity.
