# Bot Fill Reward Boundary - Data Proof

Status: planned docs-only
System: 09
Source: Fortnite ranked and team fill support
URL: https://www.epicgames.com/help/c-202300000001636/c-202300000001721/how-to-toggle-ranked-and-team-fill-modes-in-fortnite-a202300000014894

## Data And Proof

- Data seed: mode id, human count, bot count, private flag, reward eligibility, stat eligibility, proof tier, summary label.
- Event seed: mode.eligibility.loaded, botfill.applied, reward.eligibility.changed, summary.label.applied.
- Validator target: Mode matrix validator proves reward/stat labels for training, bot fill, 20-player sim, 60-player sim, and future live mode..
- Human-view proof: Results screen clearly labels practice, bot, simulated, private, or public proof status..
- Public proof must include the economy/progression ruleset id when the behavior is deploy-facing.
