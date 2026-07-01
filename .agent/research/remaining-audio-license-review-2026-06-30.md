# Remaining Audio License Review

Status: active

## Purpose

Document why the first remaining audio batch must stay sanitized-review-only until track-level provenance and human approval are complete.

## Source Notes

- Incompetech/Kevin MacLeod-style filenames are not enough to approve runtime use. The exact source page, license option, attribution requirement, and track identity must be confirmed.
- YouTube Audio Library-style provenance must be checked per track because attribution and use terms can vary by item and account-visible library terms.
- Freesound-style numeric filenames must be tied back to the exact Freesound sound page because Creative Commons license type and attribution terms are per sound.
- Browser-ready sanitized copies prove technical usability only. They do not prove redistribution rights, public Pages safety, or final GoldRush placement.

## References

- https://incompetech.com/music/royalty-free/licenses/
- https://incompetech.com/music/royalty-free/faq.html
- https://support.google.com/youtube/answer/3376882
- https://freesound.org/

## Kit Gaps

- `n:content:license-provenance`: generic candidate kit for source-page identity, license type, attribution text, and approval ids.
- `n:content:asset-promotion`: generic candidate kit for moving reviewed sanitized files into approved runtime/public registries.
- `n:goldrush:music-and-stingers`: remains blocked from legacy audio playback until approved runtime paths exist.

## Validator Implications

- The remaining audio review validator must fail missing human/license packets.
- It must keep `publicPromotion` and `runtimePromotion` false until explicit approvals exist.
- It must reject runtime paths, filled approval ids, absolute paths, and inferred approval claims.
