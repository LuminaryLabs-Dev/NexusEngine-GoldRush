# Non-Audio License Review Pipeline

Date: 2026-06-30
Status: active
Scope: grouped non-audio review packet `goldrush-dual-source-001.remaining-non-audio`

## Intent

Move copied GoldRush non-audio assets from sanitized review outputs toward explicit approval without letting filename inference, Unity metadata, or raw import presence count as permission to ship.

## Source Notes

- SPDX license identifiers are useful for normalizing license names, but an SPDX id is not evidence that this specific copied asset is permitted for this public browser game.
- Creative Commons licenses can include attribution, share-alike, non-commercial, and no-derivatives conditions. Those conditions must be checked per source asset before promotion.
- Open Source Initiative license approval is software-license oriented. It does not automatically approve game art, textures, models, Unity assets, audio, or marketplace content for redistribution.

Sources:

- https://spdx.org/licenses/
- https://creativecommons.org/cc-licenses/
- https://opensource.org/licenses

## Current Packet Facts

```txt
packet: goldrush-dual-source-001.remaining-non-audio
human review: reports/human-review/remaining-batches/goldrush-dual-source-001.remaining-non-audio-request.json
license provenance: reports/license-provenance/remaining-batches/goldrush-dual-source-001.remaining-non-audio.json
review items: 722
review domains: 39
pending human review: 722
pending license review: 722
public promotion: false
runtime promotion: false
```

## AAA Gaps

- Review quantity is too high for manual flat review. The 39 domains need batching into art-direction, gameplay-critical, reject-only, and source-reference groups.
- Model conversion requests need a separate scale/origin/collider/LOD pass before a reviewer can approve runtime use.
- Material metadata needs PBR remapping before a reviewer can judge in-game quality.
- Terrain source metadata needs a terrain interpretation pass before it can affect collider, traversal, or visual terrain.
- License evidence needs source-page records, not just Unity path names or asset filenames.
- Attribution requirements need a final credits/attribution delivery surface before promotion.

## Kit Gaps

- `n:content:review-domain-queue`: groups review items into source domains with priority, owner, status, and blocked gates.
- `n:content:license-provenance`: stores source-page evidence, license id, license URL, attribution text, and reviewer decision.
- `n:content:attribution-ledger`: exposes approved attribution text for credits, menus, and public builds.
- `n:validation:approval-records`: fails any asset with approval id but missing source-page, license, attribution, runtime path, or hash proof.

## Validator Implications

- Keep `validate-remaining-non-audio-review-packets.mjs` pending-only until real review data exists.
- Add a future approval-record validator that rejects approval by filename inference.
- Add browser proof for credits/attribution once the first approved asset requires attribution.
