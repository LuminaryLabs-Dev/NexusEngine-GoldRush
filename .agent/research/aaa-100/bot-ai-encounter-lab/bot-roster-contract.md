# Bot Roster Contract

Status: active

## Contract

A bot roster is a deterministic fixture for a proof run. It is not an account system, not a player join system, and not live authority.

## Public Data

- `modeId`: practice, bot-fill, private-proof, simulated-20, simulated-60, future-live.
- `humanCount`: invited/local browser humans.
- `botCount`: simulated actors.
- `squadCount`: roster group count.
- `proofTier`: local, public, simulator, or future live.
- `rewardEligibility`: none, practice-only, or future live eligible.

## Required Events

- `bot.roster.created`
- `bot.roster.filled`
- `bot.role.assigned`
- `bot.spawn.reserved`
- `proof.boundary.classified`

## Failure States

- Missing proof tier.
- Bots counted as humans.
- Bots assigned into the player party.
- Simulated 60-player run labeled as live 60-player run.
- Reward or stat eligibility granted by staging mode without explicit policy.
