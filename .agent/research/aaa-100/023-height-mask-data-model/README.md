# 023 Height/mask data model Child Packets

Status: active
Domain: world
Owning kit candidate: `n:goldrush:terrain-mask-data`

## Purpose
Make visual terrain, collider, object placement, routes, gold, and extraction share one source.

## Child Packets
- [Intent](child-packets/001-intent.md)
- [Current Evidence](child-packets/002-current-evidence.md)
- [Reference Research](child-packets/003-reference-research.md)
- [Data Contract](child-packets/004-data-contract.md)
- [Player View](child-packets/005-player-view.md)
- [Edge Cases](child-packets/006-edge-cases.md)
- [Validation](child-packets/007-validation.md)
- [Deploy Risk](child-packets/008-deploy-risk.md)

## Implementation Gate
Do not implement this packet until the child packets identify evidence, reference research, data contract, player-view acceptance, edge cases, validation, and deploy risk.

## Atomic Packet Layer

The next implementation pass should work from these implementation-sized atoms before touching runtime code.

- [Atomic packet index](atomic/README.md)
