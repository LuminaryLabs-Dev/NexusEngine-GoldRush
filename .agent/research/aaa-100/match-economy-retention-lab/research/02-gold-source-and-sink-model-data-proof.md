# Gold Source And Sink Model - Data Proof

Status: planned docs-only
System: 02
Source: PUBG official game overview
URL: https://pubg.com/en/game-info/overview

## Data And Proof

- Data seed: match amount, carried amount, banked amount, lost amount, spendable amount, source id, sink id, balance version.
- Event seed: gold.mined, gold.carried, gold.dropped, gold.extracted, gold.banked, gold.spent, gold.balance.changed.
- Validator target: Ledger proof verifies no duplicate gold, no negative balances, and no practice-mode persistence unless allowed..
- Human-view proof: Results screen distinguishes mined, carried, lost, extracted, banked, and score modifiers..
- Public proof must include the economy/progression ruleset id when the behavior is deploy-facing.
