# Live Network Fakeout Register

Status: active

| Fakeout | Why it is dangerous | Required guard |
| --- | --- | --- |
| Same-browser tabs called live multiplayer | It hides network and machine differences. | Proof labels include machine count and topology. |
| PeerJS callback writes gameplay receipts | Transport bypasses authority. | Gameplay receipts pass through authority ledger. |
| 60 simulated actors called 60 live players | It overclaims scale. | Simulated and live labels are separate. |
| Public Pages smoke called public networking | Static load does not prove peer connectivity. | Public network readiness probe is required. |
| Snapshot report has no byte budget | Replication can pass locally and fail at scale. | Snapshot validator records size and entity count. |
| Reconnect ignored | Real matches fail on disconnect. | Recovery policy and proof required. |
| Anti-cheat deferred entirely | P2P trust can corrupt results. | Sanity rejection boundary required before live claims. |
| Host migration undefined | Host disconnect loses match. | Host election or fail-closed policy required. |
