# Atomic Next Steps

Status: active docs-only
Domain: production planning

## Purpose

Define the smallest future implementation steps once code work resumes. These are not approved for implementation in the current docs-only phase.

## Atomic Steps

| Step | Owner | Output | Stop condition |
| --- | --- | --- | --- |
| 1 | world | Create one tiny authored terrain source fixture. | No renderer work until fixture has metadata and revision hash. |
| 2 | world | Add height, normal, slope, and masks to the fixture. | Stop if render/physics would sample different data. |
| 3 | validation | Add source fixture validator. | Stop if samples are not deterministic. |
| 4 | world/render | Add chunk descriptors without changing live visuals. | Stop if chunks lack neighbor/seam metadata. |
| 5 | physics | Build collider samples from the same source revision. | Stop if player grounding can diverge from source height. |
| 6 | render | Render one source-backed terrain chunk in a hidden/proof scene. | Stop if renderer becomes the source authority. |
| 7 | world | Add placement anchors for rocks, mine, route, and extraction. | Stop if anchors skip downward raycast and slope checks. |
| 8 | gameplay | Derive one mine target and one cashout site from masks. | Stop if gameplay uses manual debug coordinates. |
| 9 | proof | Add natural walk proof across source-backed terrain. | Stop if proof needs teleport placement. |
| 10 | release | Compare local and public source revision snapshots. | Stop if public deploy cannot prove the same revision. |

## First Implementation Slice

```txt
source fixture
-> validator
-> chunk metadata
-> collider parity
-> hidden/proof render
-> one visible terrain replacement
```

## What Not To Do First

- Do not replace the whole live terrain in one pass.
- Do not add new digital assets before placement masks exist.
- Do not make prop kits own terrain decisions.
- Do not treat LOD as visual-only.
- Do not claim AAA map progress from one screenshot.

