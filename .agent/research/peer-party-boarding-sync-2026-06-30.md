# Peer Party Boarding Sync

Status: active
Date: 2026-06-30

## Domain

Network party room / train loading / match handoff.

## Sources

- AWS GameLift FlexMatch documentation: https://docs.aws.amazon.com/gamelift/latest/flexmatchguide/match-intro.html
- Unity Lobby documentation: https://docs.unity.com/ugs/manual/lobby/manual/unity-lobby-service
- Photon matchmaking and room documentation: https://doc.photonengine.com/

## Research Takeaways

- Lobby and party systems should collect lightweight readiness and player metadata before handing off to the game session.
- The transport layer should not become the game authority. It should distribute room state, member state, and start/handoff messages.
- Readiness must be explicit in snapshots because hidden local-only state makes party transitions hard to debug.
- Match launch should keep the party attached to a single handoff contract so every client can agree on which launch it is joining.

## GoldRush Application

- PeerJS remains discovery, connection, and fanout only.
- `n:goldrush:party-lobby` now exposes `goldrush-peer-party-boarding-sync-v1` in its snapshot.
- Each browser reports its own local train boarding status.
- The peer party readiness snapshot counts only local-boarded reports from each member; auto-follow inside one browser does not masquerade as a real peer report.
- The first-sequence kit still owns the train boarding receipts and match handoff.

## Remaining Gaps

- Browser-to-browser readiness still needs live two-tab proof after this contract pass.
- The mass-match launch still needs stronger reconciliation for late disconnects during loading.
- Party readiness should eventually block or delay handoff when real peer members have not reported local boarding.
