# Unity Port Developer Packet

## Simulation Summary

A Unity port developer will evaluate whether scenes, prefabs, controllers, materials, and scripts have a safe path into browser equivalents.

## Expected Outcome

- Unity YAML is treated as layout/reference evidence.
- Prefabs become asset slots and descriptors first.
- Animator controllers become animation state vocabularies.
- Audio mixers and managers become audio state descriptors.
- Terrain and town prefabs become procedural layout descriptors until sanitized assets arrive.

## Failure Signs

- Raw `.unity`, `.prefab`, `.controller`, `.anim`, `.fbx`, or `.mat` files enter runtime.
- Unity plugin/config folders are copied.
- The port ignores scene object roles and only recreates generic western props.
- Asset conversion lacks provenance and approval fields.

## Evidence Needed

- `docs/legacy-unity-element-inventory.md`.
- Asset slot registry with placeholder status.
- Import-boundary validators.
- A future cloud import branch with pre-scan reports.

## Recommended Next Action

Ask GPT-it/cloud for more exact town prefab object lists and map them into sanitized JSON descriptors, not runtime assets.
