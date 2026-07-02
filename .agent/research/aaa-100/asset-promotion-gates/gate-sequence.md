# Asset Promotion Gate Sequence

Status: active docs-only

## Purpose

Make asset promotion linear, inspectable, restartable, and deny-by-default.

## Sequence

1. Source Candidate Intake: Candidate record exists with source URL, pack name, intended asset family, and no runtime path.
2. License Evidence: License record names the exact license, source evidence, attribution requirement, and unresolved questions.
3. Provenance Evidence: Provenance record links source page, pack version or retrieval date, author/source identity, and hashable bytes.
4. File Integrity Hash: Each source and output file has deterministic hash, byte size, MIME or format classification, and scan result.
5. Format And Conversion: Conversion plan declares input format, output format, conversion tool, loss notes, and unsupported fields.
6. Toon Adaptation: Adaptation record defines palette role, outline policy, material simplification, and screenshot acceptance.
7. Scale Pivot Origin: Transform contract records units, pivot, forward axis, ground anchor, bounds, and raycast placement offset.
8. Performance Budget: Budget record includes triangles, draw calls, material count, texture memory, animation clips, and LOD plan.
9. Protokit Registration: Every runtime candidate maps to a named protokit with domainPath, public API, events, snapshot, reset, and validator.
10. Terrain Placement: Placement record names terrain source revision, mask, slope limits, raycast result, and avoid/cluster tags.
11. Collider Interaction Role: Collider and interaction role record declares physical body, affordance, interaction range, and receipt outcome.
12. Human Review Decision: Review decision records owner lane, decision status, approval id when approved, rejection reason when blocked, and review evidence.
13. Approved Runtime Promotion: Promotion record writes only safe browser runtime paths, registry entries, source/output hash links, and approval ids.
14. Browser Public Proof: Local and public browser proof screenshots show the asset in its intended scene, with state snapshot and no report leaks.
15. Rollback Restart: Restart packet records what was learned, what asset revision is blocked, what successor decision replaces it, and how to revert.

## Atomic Pass Rule

Each phase advances only after its policy, data, validator, and human-proof packet are satisfied. Skipping a phase is a failed promotion, even if the file appears visually useful.

## Stop Conditions

- Missing source URL or source identity.
- Missing or ambiguous license.
- Missing hash continuity.
- Converted output has no review path.
- Asset has no terrain placement rule.
- Asset has no protokit owner.
- Asset has no human decision.
- Asset has no browser-visible proof when it is visual or audible.
- Public proof is stale, narrower than local proof, or leaks local/report-sensitive data.

