# Release Review Packet

## Simulation Summary

A release reviewer will accept incremental progress only if the build, deploy, browser proof, docs, and import safety gates all stay green.

## Expected Outcome

- `npm run check` passes.
- `Build` branch deploys to GitHub Pages.
- PR to `development` stays green.
- Public URL loads the current build.
- Docs and `.agent` packets explain the current truth without overstating asset import status.

## Assumptions

- The full final goal is not complete until assets are copied, sanitized, promoted, and both old versions are playable as one game.
- Current slices can still be merged if they move the end state forward safely.

## Failure Signs

- Green tests but blank/poor player-view screenshot.
- Docs say final goal is complete while raw assets are still missing.
- Build branch deploys but PR checks fail or default branch lags.
- Local state differs from public Pages proof.

## Evidence Needed

- Latest commit hash.
- GitHub Actions deploy URL.
- Public Pages URL with cache-buster.
- Browser screenshot or DOM proof.
- Clear remaining-gap list.

## Recommended Next Action

After each broad pass, push `Build`, verify Pages, update PR, and keep the goal active until final asset/gameplay requirements are actually met.
