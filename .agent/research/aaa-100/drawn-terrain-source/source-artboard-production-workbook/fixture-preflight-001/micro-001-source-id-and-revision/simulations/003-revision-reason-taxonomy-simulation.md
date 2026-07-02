# 003 - Revision Reason Taxonomy Simulation

Status: active docs-only
Parent atom: `001-source-id-and-revision`

## Simulated Implementation

1. Add the minimum source field for revisionReason enum and short note.
2. Add the negative validator case.
3. Expose the value in the source fixture snapshot.
4. Require one consumer echo.
5. Prove every revision explains whether source, mask, annotation, LOD, or proof changed.
6. Mark proof stale if source revision changes.

## Likely Failure

source changes happen without knowing which consumers became stale.

## Recovery

- Stop downstream consumer expansion.
- Fix source identity first.
- Add a failing case before a passing case.
- Re-run local and public proof only after the snapshot reports the correct identity.
