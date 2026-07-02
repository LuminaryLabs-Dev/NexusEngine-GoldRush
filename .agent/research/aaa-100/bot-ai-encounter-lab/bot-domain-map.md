# Bot Domain Map

Status: active

## Domain Shape

```txt
runtime simulation proof
-> ai role taxonomy
-> bot roster
-> route intent
-> terrain movement
-> objective agents
-> combat agents
-> encounter director
-> results and proof labels
```

## Ownership Rules

- Runtime owns proof labels, reset, snapshots, report hygiene, and run identity.
- AI owns role, roster, behavior state, target choice, and difficulty persona.
- World owns terrain masks, route masks, cover descriptors, resource descriptors, and extraction descriptors.
- Physics owns grounding and collision queries.
- Gameplay owns mining, cargo, extraction, combat receipts, scoring, and results.
- Render owns visible cues only.

## Data Flow

1. Mode policy declares human count, bot count, reward eligibility, and proof label.
2. Roster kit creates deterministic bot identities and roles.
3. Route kit chooses objectives from world masks and gameplay state.
4. Movement kit steps bots through shared terrain/collider queries.
5. Objective kits generate mining, cargo, and cashout intents.
6. Combat kits generate threat cues, cover, weapon timing, and recovery.
7. Encounter director schedules pressure and quiet windows.
8. Match kits record receipts and results with bot/human labels.
9. Proof kit writes sanitized local/public/simulated reports.

## Stop Conditions

- Stop if any bot movement bypasses terrain queries.
- Stop if any bot proof is described as live multiplayer proof.
- Stop if combat damage arrives before a readable telegraph.
- Stop if reports omit proof tier or human/bot counts.
- Stop if a renderer-only bot behavior appears without a kit contract.
