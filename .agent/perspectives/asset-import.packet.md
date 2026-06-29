# Asset Import Packet

## Simulation Summary

An asset-import reviewer will not accept playable claims until raw legacy assets pass private scan, provenance, sanitation, conversion, and promotion gates.

## Expected Outcome

- No local clone of old Unity repos.
- No raw Unity asset in runtime.
- Import jobs have manifests, secret scan reports, classification reports, and provenance.
- Promoted assets expose runtime paths under `public/assets/`.
- Placeholder slots remain stable until promotion.

## Assumptions

- The destination repo is public, so raw import requires pre-public scanning.
- Third-party western packs may be blocked or require replacement.
- Asset evidence can guide descriptors before real assets are approved.

## Failure Signs

- `.unity`, `.prefab`, `.controller`, `.anim`, `.fbx`, or `.mat` files appear in runtime paths without provenance.
- Photon/Fusion, DOTween, Odin, package manifests, or ProjectSettings are copied.
- Placeholder slots are replaced without source hash, output hash, approval id, and runtime path.

## Evidence Needed

- `tools/validation/validate-import-boundaries.mjs`
- `tools/validation/validate-report-secrets.mjs`
- `tools/import-sanitize/validate-asset-gates.mjs`
- Asset registry proof that promoted assets have required fields.

## Recommended Next Action

Continue descriptor-first implementation locally and ask GPT-it/cloud to perform private source-side scan/import when ready.
