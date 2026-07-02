# Authoring Restart Policy

Status: active docs-only
Domain: runtime / release / restart
Future kit: `n:runtime:snapshot`

## Problem

Terrain source work is high-risk because a future restart can mix old renderer chunks, new collider samples, stale proof reports, and mismatched public deploys.

## Required Restart Data

Every authored terrain fixture and proof should carry:

```txt
sourceId
revisionHash
fixtureSchemaVersion
authoringPolicyVersion
generatedConsumerRevisions
validatorVersion
localProofRevision
publicProofRevision
```

## Restart Rules

- If `sourceRevision` changes, render chunks must be regenerated.
- If `sourceRevision` changes, collider samples must be regenerated.
- If mask dimensions change, anchors and gameplay zones must be regenerated.
- If bounds or scale changes, route guidance and camera tests must rerun.
- If chunk topology changes, LOD seam tests must rerun.
- If public proof sees a different revision than local, deployment status stays unresolved.

## Rollback Rule

Rollback should select a full source fixture revision, not a partial mix of old height, new masks, and old anchors.

## Stop Condition

Stop if a future implementation cannot answer which source revision produced the visible terrain, collider, anchors, gameplay zones, and proof report.

