# Fairness And Abuse Boundary - Data Proof

Status: planned docs-only
System: 15
Source: Fortnite ranked and team fill support
URL: https://www.epicgames.com/help/c-202300000001636/c-202300000001721/how-to-toggle-ranked-and-team-fill-modes-in-fortnite-a202300000014894

## Data And Proof

- Data seed: action id, authority source, client claim, server/sim validation state, reward eligibility, suspicion reason.
- Event seed: claim.submitted, claim.validated, claim.rejected, reward.blocked, fairness.alerted.
- Validator target: Abuse simulation tries duplicate mine, out-of-range cashout, impossible cargo, stale party reward, and replay mutation..
- Human-view proof: Validation report shows rejected impossible reward claims and explains which modes are proof-only..
- Public proof must include the economy/progression ruleset id when the behavior is deploy-facing.
