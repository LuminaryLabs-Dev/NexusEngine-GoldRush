# Promotion Rules

Status: active docs-only

## Purpose

Define when a system can move from one rebuild version into the next.

## Part States

| State | Meaning | Can promote? |
| --- | --- | --- |
| validated | Current proof covers the claimed behavior and names the owning kit. | yes |
| partial | Some proof exists, but the claim is narrower than the target. | no |
| fake | Proof can pass through helper-only, debug-only, marker-only, or stale state. | no |
| broken | Current evidence contradicts the intended behavior. | no |
| missing | The part is planned but not implemented. | no |
| stale | The part worked before, but current source, build, or public proof is outdated. | no |

## Required Promotion Fields

Every promoted part must name:

- `version`
- `domain`
- `genericKit`
- `goldrushKit`
- `sourceData`
- `publicApi`
- `events`
- `snapshot`
- `validator`
- `browserProof`
- `publicProof`
- `knownLimits`
- `lesson`

## Version Packet Fields

Every version packet must also name:

- source state
- inherited validated parts
- rejected parts
- broken/fake/stale parts
- lessons applied
- current implementation slice
- validation results
- promotion decision
- next-turn recommendation

## Fakeout Checks

Reject promotion if:

- a renderer marker creates gameplay truth
- a gameplay helper bypasses player action
- a screenshot proves existence but not interaction
- a simulator proof is described as live multiplayer
- a local proof is described as public proof
- a candidate asset is treated as approved runtime content
- camera, physics, or terrain state can drift without stale-proof failure
- the feature only works because of a test helper
- a debug-only UI or proof hook stands in for player-facing interaction
- the next version would need to inherit an entire old subsystem to keep the feature alive

## Version Gate

Each rebuild version turn must end with a continue-or-increment recommendation plus a promotion decision:

```txt
promote
promote with limits
hold
reject
```

`promote with limits` must describe the exact claim that is safe to carry forward.

If the newest version is stuck, structurally wrong, helper-heavy, stale, fake, or accumulating hacks, the next recommendation is `increment`.
