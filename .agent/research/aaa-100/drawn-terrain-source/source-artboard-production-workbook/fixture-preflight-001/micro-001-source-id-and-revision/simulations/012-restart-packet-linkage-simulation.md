# 012 - Restart Packet Linkage Simulation

Status: active docs-only
Parent atom: `001-source-id-and-revision`

## Simulated Implementation

1. Add the minimum source field for restart packet fields and lesson-update trigger.
2. Add the negative validator case.
3. Expose the value in the source fixture snapshot.
4. Require one consumer echo.
5. Prove source revision changes require restart packet fields before row status changes.
6. Mark proof stale if source revision changes.

## Likely Failure

new terrain knowledge is lost between planning and implementation passes.

## Recovery

- Stop downstream consumer expansion.
- Fix source identity first.
- Add a failing case before a passing case.
- Re-run local and public proof only after the snapshot reports the correct identity.
