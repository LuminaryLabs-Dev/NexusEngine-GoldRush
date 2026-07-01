# Public Full Loop Proof

Status: active
Date: 2026-06-30

## Sources

- GitHub Pages custom workflows: https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages
- Playwright auto-waiting and actionability: https://playwright.dev/docs/actionability
- Vite static deployment guide: https://vite.dev/guide/static-deploy.html#github-pages

## Domain Read

The public build proof should not stop at "page loaded" or "runtime scene mounted." For GoldRush, public deploy readiness means the hosted app proves the playable loop:

```txt
title -> lobby -> loading-yard train -> gold-field -> extraction -> results
```

## Gap

The public smoke script proved title, lobby, loading-yard train, and 20-player gold-field entry. After adding `site.results`, that was no longer enough. A public deployment could pass while the end-of-run result/replay screen was broken.

## Kit/Proof Direction

- Keep GitHub Pages deployment as the public artifact boundary.
- Keep browser proof state-driven: wait for `screen`, `activeSite`, and loaded kit groups before forcing proof actions.
- Use query-gated proof helpers only for reliability in CI and public smoke, not as normal gameplay.
- Validate visible results text as well as runtime snapshots.
- Capture retained report JSON and screenshots with sanitized paths.

## Acceptance

The public smoke proof must now verify:

- `site.gold-field` loads before result completion is forced
- extraction finalizes through the public smoke action
- `site.results` activates
- `results-summary` and `replay-summary` kit groups are loaded
- result status is final
- lockdown contest summary is visible
- called threat `claim-jumper-01` is preserved
- visible text includes replay moments
- visible text does not expose raw `goldrush.condition.*` ids

## Risk

The public smoke script uses browser timing and async scene activation. It must wait for kit groups, not just `screen`, or it can race the app shell and capture stale site-loader state.
