# Economy Domain Map

Status: active docs-only

## Purpose

Map economy and retention concerns to owner kits so reward logic does not hide inside renderer code, results UI, or proof helpers.

| System | Domain | Generic kit | GoldRush kit | First proof |
| 01 Run Value Ladder | gameplay/economy/match | n:gameplay:value-ladder | n:goldrush:run-value-ladder | Human-view proof shows a player identify a valuable target, mine it, carry it, risk it, extract it, and see payoff. |
| 02 Gold Source And Sink Model | gameplay/economy/progression | n:gameplay:economy-balance | n:goldrush:gold-economy | Results screen distinguishes mined, carried, lost, extracted, banked, and score modifiers. |
| 03 Loot And Tool Table | gameplay/content/economy | n:gameplay:loot-table | n:goldrush:western-tools | Player-view proof shows at least one mining tool, movement tool, combat item, and extraction utility with distinct silhouettes. |
| 04 Claim Contract Objectives | gameplay/objectives/match | n:gameplay:contract-objectives | n:goldrush:claim-contracts | Human-view proof shows contract selection, route, progress, contest, completion, and result recap. |
| 05 Risk Reward Tiers | gameplay/balance/world | n:gameplay:risk-reward | n:goldrush:risk-reward-tiers | Screenshots show low/medium/high reward zones with visible route risk and cover options. |
| 06 Extraction Stakes And Loss | gameplay/match/results | n:gameplay:extraction-stakes | n:goldrush:extraction-stakes | Show successful cashout, failed cashout, interrupted cashout, dropped cargo, and recovered cargo variants. |
| 07 Final Rush Pressure Economy | battle-royale/match/economy | n:match:zone-pressure | n:goldrush:final-rush-pressure-economy | Capture early, mid, late, and collapse phases with route/cashout/value changes. |
| 08 Squad Role And Share Rules | team/economy/network | n:team:reward-share | n:goldrush:squad-share-rules | Lobby and results show group type, shared run objective, assists, extraction contribution, and score split. |
| 09 Bot Fill Reward Boundary | staging/progression/network | n:staging:reward-boundary | n:goldrush:bot-fill-reward-boundary | Results screen clearly labels practice, bot, simulated, private, or public proof status. |
| 10 Replay Lesson Loop | match/replay/product | n:match:replay-summary | n:goldrush:run-lesson-summary | Results show route choice, greed moment, combat pressure, cashout decision, and next-run hint. |
| 11 Progression Without Grind | progression/product/ux | n:progression:unlock-rules | n:goldrush:progression-boundary | Results and lobby show optional unlock progress without blocking Play/Practice/Run Again. |
| 12 Challenge And Contract Rotation | live-ops/objectives/progression | n:progression:challenge-rotation | n:goldrush:claim-challenge-rotation | Lobby or results can show one optional claim challenge without crowding hero controls. |
| 13 Cosmetic And Identity Boundary | presentation/progression/content | n:presentation:cosmetic-loadout | n:goldrush:prospector-identity | Lobby preview shows identity slots while results and gameplay show only approved/equipped safe assets. |
| 14 Tuning And Telemetry Ledger | validation/balance/runtime | n:runtime:tuning-ledger | n:goldrush:balance-ledger | Scenario reports show value/time/threat/cashout outcomes for baseline, easy, hard, and 60-player simulated modes. |
| 15 Fairness And Abuse Boundary | network/security/economy | n:runtime:fairness-boundary | n:goldrush:economy-fairness | Validation report shows rejected impossible reward claims and explains which modes are proof-only. |
| 16 Release Versioned Economy Policy | release/governance/economy | n:release:economy-version | n:goldrush:economy-release-policy | Local and public live-state reports show the same economy version, mode eligibility, and result calculation. |
