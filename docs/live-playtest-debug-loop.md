# Live Playtest Debug Loop

## Purpose

Gold Rush visual and gameplay work should regularly pause for a live human playtest. The player reports one thing to change, then Codex implements that one thing and revalidates.

## Debug URL

```txt
http://localhost:5177/NexusEngine-GoldRush/
```

## Loop Contract

- Codex verifies the local app is live.
- Codex may run `npm run playtest:doctor` to confirm the live URL and default runtime contract.
- User plays the current build.
- User gives exactly one change request.
- Codex implements only that change.
- Codex runs `npm run check`.
- Codex captures a Playwright screenshot.
- Codex asks for the next one-change playtest note.

## Why

This keeps the project aligned with actual playability instead of only screenshots, metrics, kit counts, or architecture plans.
