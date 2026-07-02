# Runtime Promotion Contract

Status: active docs-only

## Purpose

Define the only acceptable runtime asset state for GoldRush.

## Runtime Asset Contract

A runtime asset must have:

- source candidate id.
- exact source URL or source evidence id.
- license evidence id.
- provenance evidence id.
- source hash.
- output hash.
- conversion record when converted.
- toon adaptation record when visual.
- transform and placement contract when world-facing.
- performance budget.
- protokit registration.
- collider or interaction role when gameplay-facing.
- human approval id.
- safe browser-relative runtime path.
- local browser proof.
- public browser proof.

## Invalid Runtime States

- Candidate-only assets in gameplay.
- Review copies in gameplay.
- Sanitized outputs in gameplay without promotion.
- Runtime path before approval.
- Renderer-only mesh with no kit owner.
- Asset visible locally but missing from public proof.

## Minimal Public API Shape

```txt
assetPromotion.publicApi
|-- getCandidate(candidateId)
|-- getGateStatus(candidateId)
|-- getApprovedRuntimeAsset(assetKitId)
|-- listBlockedCandidates(familyId)
|-- listPromotedAssets(siteId)
```

The private API may do hash checks, path validation, source evidence joins, and report generation. The public API should expose only status, safe metadata, and approved runtime records.

