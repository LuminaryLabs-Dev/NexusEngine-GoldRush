# Final Rush Cashout Pressure

Status: active

## Intention

GoldRush should not treat final rush as only a background match phase. In a battle-royale extraction game, the closing pressure must directly affect route choice, cashout risk, and scoring receipts.

## Source Notes

- Apex-style ring pressure works because it compresses playable space and turns late movement into a readable survival decision.
- Fortnite-style storm pressure works because the match boundary becomes a player-facing timer and damage/routing constraint.
- Hunt-style extraction works because bounty/cashout is a high-risk public objective, not only an inventory deposit.

## Domain Web

```txt
n:goldrush:final-rush
├─ owns collapse status, zone pressure, and extraction multiplier
├─ exposes pressureForGoldZone()
└─ remains reusable match pressure logic

n:goldrush:cashout-sites
├─ resolves the mined site into a real gold zone
├─ reads final-rush pressure at extraction time
├─ increases hold/contest pressure under collapse
└─ stores the pressure context on receipts

n:goldrush:extraction-receipts
├─ applies final-rush multiplier only when goldZoneId is valid
├─ serializes pressureScalar and multiplier
└─ feeds scoring/results/replay
```

## Kit Gap Closed

Before this pass, the extraction-loop receipt passed `mine-seam-01` as `goldZoneId`, so `n:goldrush:final-rush` could not apply its zone multiplier to the playable cashout loop.

This pass links extraction-loop mining sites to `gold.zone.west-drywash`, exposes `goldrush-final-rush-extraction-pressure-v1`, and preserves that context through extraction contest state and accepted receipts.

## Validator Implications

- `validate-goldrush-extraction-loop.mjs` must arm final rush before cashout.
- It must prove the loop snapshot exposes active pressure.
- It must prove accepted receipts preserve the real gold zone id.
- It must prove `pressureScalar > 0` and `multiplier > 1` on the receipt ledger.

## Sources

- EA Apex Legends official site: https://www.ea.com/games/apex-legends
- Fortnite official site: https://www.fortnite.com/
- Hunt: Showdown official game page: https://www.huntshowdown.com/game
