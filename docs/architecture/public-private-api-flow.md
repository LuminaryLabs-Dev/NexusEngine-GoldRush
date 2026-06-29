# Public And Internal API Flow

## Rule

Config stays minimal. Public APIs and events control behavior. Internal APIs do implementation work behind the scenes.

```txt
minimal config
├─ ids
├─ seeds
├─ tuning numbers
└─ feature flags

public API
├─ commands
├─ queries
├─ snapshots
└─ validation

events
├─ emitted facts
├─ receipts
├─ phase changes
└─ proof/debug trail

internal API
├─ collider sync
├─ terrain sampling
├─ network partitioning
├─ renderer batching
├─ receipt indexing
└─ scoring calculation
```

## Flow

```txt
UI/input
-> public API command
-> internal API work
-> event/receipt
-> snapshot
-> renderer/HUD/debug consumer
```

## Domain Examples

- `n:world:terrain-raycast` exposes `raycastDown`; internal helpers own barycentric triangle tests.
- `n:network:room-partitions` exposes `joinPlayer`; internal helpers own compaction and retained partitions.
- `n:gameplay:extraction` exposes `deposit`; internal helpers own duplicate protection and multiplier application.
- `n:match:scoring` exposes `applyReceipt`; internal helpers own leader sorting and modifier rules.
- `n:goldrush:gold-field-renderer` consumes descriptors; it does not own match, cargo, combat, or scoring state.
