# 005 - Authoring Metadata Minimum Simulation

Status: active docs-only
Parent atom: `001-source-id-and-revision`

## Simulated Implementation

1. Add the minimum source field for authoring note, source family, intended slice, no private path fields.
2. Add the negative validator case.
3. Expose the value in the source fixture snapshot.
4. Require one consumer echo.
5. Prove metadata is useful for restart but safe for public reports.
6. Mark proof stale if source revision changes.

## Likely Failure

debugging needs context but reports leak irrelevant local details.

## Recovery

- Stop downstream consumer expansion.
- Fix source identity first.
- Add a failing case before a passing case.
- Re-run local and public proof only after the snapshot reports the correct identity.
