# License Risk Matrix

Status: active docs-only

## Purpose

Classify source risk before any candidate is downloaded, converted, imported, or promoted.

## Matrix

| Source class | Risk | Reason | Required gate |
| --- | --- | --- | --- |
| CC0 asset page with direct files | low | public-domain-style license is visible at source | capture source URL, license, file list, hash |
| Free personal/commercial page with direct files | medium | may be permissive but not always formal CC0 | capture terms, author, source page, file list, review decision |
| Marketplace page with free tier | medium-high | free tier can differ from paid tier and may change | capture exact tier, exact files, exact terms |
| Community archive with mixed licenses | high | each item can have different terms | item-level license and author record required |
| Royalty-free stock audio | high | often has prohibited uses or redistribution limits | legal/content-license review before use |
| Login, Discord, purchase, or claim-only source | blocked by default | source evidence and reproducible access are weak | do not use until direct evidence exists |

## Preferred Sources For First Pass

1. Kenney CC0 pages.
2. Poly Pizza CC0 GLTF bundles from known creators.
3. Quaternius direct pack pages with direct download evidence.
4. KayKit item pages with CC0 and GLTF/FBX evidence.

## Caution Sources

- OpenGameArt: useful, but every asset has its own license and preview media may differ from downloadable files.
- Freesound: useful only with CC0 filter and per-sound evidence.
- Pixabay: useful fallback, but its license is not CC0 and must be treated as project-policy review work.

## Rejection Rule

If the next agent cannot prove the exact license for the exact file, the file remains out of runtime.

