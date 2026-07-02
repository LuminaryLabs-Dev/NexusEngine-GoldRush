# Kit Gap Register

Status: active

| Gap | Generic kit candidate | GoldRush kit candidate | Priority |
| --- | --- | --- | --- |
| Network Mode Policy | `n:network:mode-policy` | `n:goldrush:network-mode-policy` | high |
| Party To Match Handoff | `n:network:party-match-handoff` | `n:goldrush:party-to-match-handoff` | high |
| Live Room Authority | `n:network:room-authority` | `n:goldrush:live-room-authority` | high |
| Host Election And Migration | `n:network:host-election` | `n:goldrush:host-election-migration` | high |
| Peer Transport Adapter | `n:network:peer-transport` | `n:goldrush:peer-transport-adapter` | high |
| Signaling And ICE Readiness | `n:network:connection-readiness` | `n:goldrush:signaling-ice-readiness` | high |
| Interest Management Regions | `n:network:interest-management` | `n:goldrush:interest-management-regions` | high |
| Replication Snapshot Contract | `n:network:replication-snapshot` | `n:goldrush:replication-snapshot-contract` | high |
| Delta Compression And Priority | `n:network:delta-priority` | `n:goldrush:delta-compression-priority` | high |
| Input Command Buffer | `n:network:input-buffer` | `n:goldrush:input-command-buffer` | high |
| Prediction Reconciliation | `n:network:prediction-reconciliation` | `n:goldrush:prediction-reconciliation` | high |
| Authoritative Receipt Ledger | `n:network:receipt-ledger` | `n:goldrush:authoritative-receipt-ledger` | high |
| Partition Handoff And Cross Room Events | `n:network:partition-handoff` | `n:goldrush:partition-handoff-events` | high |
| Disconnect Rejoin Recovery | `n:network:reconnect-recovery` | `n:goldrush:disconnect-rejoin-recovery` | high |
| Latency Jitter Loss Simulator | `n:network:chaos-simulator` | `n:goldrush:latency-jitter-loss-simulator` | high |
| Fairness Sanity Abuse Boundary | `n:network:sanity-boundary` | `n:goldrush:fairness-sanity-abuse-boundary` | high |
| Live Proof Harness | `n:network:live-proof` | `n:goldrush:live-proof-harness` | high |
| Public Deploy Network Readiness | `n:network:deploy-readiness` | `n:goldrush:public-deploy-network-readiness` | high |

## Implementation Implication

The first future coding pass should start with mode labels, PeerJS transport adapter, authority ledger, and replication snapshot schema. That creates a truthful network foundation before scaling actor count or attempting live 60-player proof.
