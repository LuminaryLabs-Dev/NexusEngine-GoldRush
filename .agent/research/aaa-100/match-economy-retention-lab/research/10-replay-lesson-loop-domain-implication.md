# Replay Lesson Loop - Domain Implication

Status: planned docs-only
System: 10
Source: Fortnite team fill support
URL: https://www.epicgames.com/help/c-202300000001636/c-202300000001721/unable-to-find-teammates-while-playing-in-duos-trios-or-squad-in-battle-royale-and-zero-build-modes-in-fortnite-a202300000014690

## Domain Implication

- Owning domain: match/replay/product.
- Generic candidate: n:match:replay-summary.
- GoldRush custom kit: n:goldrush:run-lesson-summary.
- The UI may present rewards, but it must not calculate them.
- The renderer may show value, but it must not own eligibility.
- Result screens may summarize receipts, but receipts must originate from domain kits.
