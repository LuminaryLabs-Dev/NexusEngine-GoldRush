# 040 Prop protokit library - Deploy Risk

Status: active
Domain: content

## Deploy Risks
- Local docs or proof can pass while public Pages is stale.
- Generated reports can leak local machine paths if sanitizer coverage is skipped.
- New assets can accidentally bypass approval/promotion gates.
- A Build branch deploy can package stale or overly broad proof claims.
- A visual feature can pass CLI validation while looking unreadable in browser.

## Deploy Gate
- Keep docs and reports sanitized.
- Run public proof for deployed player-facing claims.
- Keep rollback or restart notes in the packet if implementation changes the release surface.
