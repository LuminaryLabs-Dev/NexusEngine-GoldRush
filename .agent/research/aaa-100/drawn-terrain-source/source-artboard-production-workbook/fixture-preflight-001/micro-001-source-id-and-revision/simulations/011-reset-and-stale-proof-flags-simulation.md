# 011 - Reset And Stale Proof Flags Simulation

Status: active docs-only
Parent atom: `001-source-id-and-revision`

## Simulated Implementation

1. Add the minimum source field for reset behavior and stale proof flags.
2. Add the negative validator case.
3. Expose the value in the source fixture snapshot.
4. Require one consumer echo.
5. Prove revision changes mark render, collider, placement, gameplay, local proof, and public proof stale.
6. Mark proof stale if source revision changes.

## Likely Failure

old proof is reused after source changes.

## Recovery

- Stop downstream consumer expansion.
- Fix source identity first.
- Add a failing case before a passing case.
- Re-run local and public proof only after the snapshot reports the correct identity.
