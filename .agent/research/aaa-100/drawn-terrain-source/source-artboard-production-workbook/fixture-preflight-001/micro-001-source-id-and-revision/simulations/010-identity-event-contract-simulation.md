# 010 - Identity Event Contract Simulation

Status: active docs-only
Parent atom: `001-source-id-and-revision`

## Simulated Implementation

1. Add the minimum source field for loaded, rejected, changed, consumerReady, consumerDrift events.
2. Add the negative validator case.
3. Expose the value in the source fixture snapshot.
4. Require one consumer echo.
5. Prove events carry fixtureId, revisionId, and consumer id when relevant.
6. Mark proof stale if source revision changes.

## Likely Failure

state changes happen without a replayable event trail.

## Recovery

- Stop downstream consumer expansion.
- Fix source identity first.
- Add a failing case before a passing case.
- Re-run local and public proof only after the snapshot reports the correct identity.
