# Bot Terrain Movement Edge Case Audit

Status: planned

## Edge Cases

- Scene transition resets this system while bot state is mid-action.
- Public proof has different frame timing from local proof.
- A bot objective becomes unreachable because terrain masks changed.
- A report labels simulated actors as humans.
- Renderer shows a cue but the domain snapshot lacks a matching event.
- Difficulty or density creates impossible pressure for solo staging.
- The system grants progression, score, or stat meaning in a mode that should be proof-only.

## Hardening

- Add reset proof.
- Add proof-tier labels.
- Add snapshot serialization proof.
- Add one fakeout flag for overclaims.
- Add human-view screenshot proof if this affects player perception.

## Main Risk

If bots use simpler movement than players, staging will miss terrain/collider regressions.
