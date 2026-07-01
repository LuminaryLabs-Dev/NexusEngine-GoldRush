# Combat Outcome Results

Status: active

## Purpose

Document why GoldRush results and replay summaries need to preserve combat pressure, not only extracted gold.

## Sources

- Hunt: Showdown developer UI note on post-mission summary and Accolade Cards: https://www.huntshowdown.com/news/developer-insight-upcoming-ui-improvements
- Hunt: Showdown Accolade summary reference: https://huntshowdown.fandom.com/wiki/Accolade
- Crytek Devil's Trail update: https://www.crytek.com/news/devils-trail-transforms-hunt-showdown-1896
- Apex Legends player discussion around match summary damage/kills/assists: https://forums.ea.com/discussions/apex-legends-general-discussion-en/kills-and-assists/5755168

## Domain Findings

- Extraction results need to explain both payout and risk.
- Mission summaries work better when they expose achievement cards/awards instead of only a raw winner line.
- Combat contribution matters even when extraction is the main win condition.
- Player-facing summaries should preserve tactical context: damage, threat lanes, final pressure, and extraction danger.
- Summary data should be generated from receipts so replay, scoring, and UI stay deterministic.

## Kit Gap

```txt
n:goldrush:ambush-pressure
└─ owns readable combat receipts

n:goldrush:results-screen
└─ should summarize combat outcomes as awards and final read data

n:goldrush:replay-summary
└─ should include combat moments beside extraction and handoff moments
```

## Implementation Implication

- Do not compute combat outcomes in DOM.
- Add `combatOutcomeSummary` to result/replay snapshots.
- Use extraction-loop combat receipts because they carry telegraph IDs, lane IDs, damage, and counterplay.
- Add awards only from deterministic receipt state.
- Keep actual combat gameplay marked prototype until aiming, projectiles, hit reactions, and promoted weapon/audio assets exist.

## Validator Implication

- End-match validation should prove combat outcome summary exists.
- Extraction-loop validation should prove combat receipts survive into results and replay.
- Replay key moments should include combat pressure/damage moments with lane and telegraph IDs.
