# Asset Promotion Failure Mode Register

Status: active docs-only

## Register

| Failure | Why it matters | Hardening |
| --- | --- | --- |
| Candidate treated as runtime | The browser may ship unapproved assets. | Block runtime paths until promotion planner writes them. |
| Source channel treated as license proof | A pack or item can have different rights than the source homepage suggests. | Require per-asset or per-pack evidence. |
| No provenance trail | The team cannot prove origin, version, or source identity later. | Write provenance records before conversion. |
| Hash continuity broken | Review and runtime files may not match source or approval records. | Hash source and output at every phase. |
| Conversion hides loss | Visual/audio quality or rig data can disappear without review. | Record unsupported fields and conversion loss notes. |
| No toon adaptation | Imported assets clash with the target wild-west toon style. | Require palette/material/outline review. |
| Transform unknown | Assets float, clip, rotate, or spawn underground. | Require pivot, bounds, ground anchor, and raycast offset. |
| No performance budget | 60-player browser target becomes impossible. | Require per-family budget and LOD/instancing policy. |
| Renderer owns meaning | Gameplay cannot interact with anonymous meshes. | Require protokit registration before runtime use. |
| No terrain placement rule | Map readability becomes clutter and scatter. | Require source terrain masks and raycast proof. |
| No collider role | Players cannot trust what they see. | Declare physical and interaction roles. |
| Human review skipped | Legal, art, and product judgment are replaced by scripts. | Require owner-lane decision packets. |
| Local-only proof | Public Pages can still be stale or broken. | Require public browser proof for promoted runtime assets. |
| No restart path | Bad assumptions stay embedded. | Write a restart packet when a phase fails. |

