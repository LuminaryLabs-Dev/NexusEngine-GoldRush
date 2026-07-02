# 002 - Revision Id Format Simulation

Status: active docs-only
Parent atom: `001-source-id-and-revision`

## Simulated Implementation

1. Add the minimum source field for revisionId deterministic short id.
2. Add the negative validator case.
3. Expose the value in the source fixture snapshot.
4. Require one consumer echo.
5. Prove validator rejects empty, random, or non-repeatable revision ids.
6. Mark proof stale if source revision changes.

## Likely Failure

revisions cannot be compared between local and public proof.

## Recovery

- Stop downstream consumer expansion.
- Fix source identity first.
- Add a failing case before a passing case.
- Re-run local and public proof only after the snapshot reports the correct identity.
