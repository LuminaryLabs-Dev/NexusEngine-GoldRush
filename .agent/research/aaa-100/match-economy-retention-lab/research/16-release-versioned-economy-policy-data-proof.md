# Release Versioned Economy Policy - Data Proof

Status: planned docs-only
System: 16
Source: Fortnite team fill support
URL: https://www.epicgames.com/help/c-202300000001636/c-202300000001721/unable-to-find-teammates-while-playing-in-duos-trios-or-squad-in-battle-royale-and-zero-build-modes-in-fortnite-a202300000014690

## Data And Proof

- Data seed: economy version, content version, ruleset id, deploy branch, proof date, compatibility, migration note.
- Event seed: economy.version.loaded, release.rule.changed, proof.version.recorded, restart.packet.written.
- Validator target: Release validator proves local/public ruleset ids match and result reports include economy/progression version..
- Human-view proof: Local and public live-state reports show the same economy version, mode eligibility, and result calculation..
- Public proof must include the economy/progression ruleset id when the behavior is deploy-facing.
