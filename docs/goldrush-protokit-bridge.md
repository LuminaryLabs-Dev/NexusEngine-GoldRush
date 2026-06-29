# GoldRush ProtoKit Bridge

## Purpose

`engine.n.goldrushProtoKitBridge` loads the reusable NexusRealtime ProtoKit route/cargo/extraction stack as a safe source for Gold Rush mine -> carry -> cashout behavior.

## Loaded ProtoKits

```txt
generic-route-progress-kit
generic-resource-loop-kit
generic-pressure-loop-kit
generic-route-cargo-extraction-kit
```

## GoldRush Mapping

```txt
route checkpoints
├─ mine-seam
├─ carry-gold
└─ cashout-site

cargo
└─ gold

pressure
└─ ambush-pressure
```

The bridge exposes reusable ProtoKit descriptors and snapshots. It does not own GoldRush match lifecycle, scoring, receipts, room handoff, assets, renderer state, or final game rules. Those remain owned by custom GoldRush kits, especially `engine.n.goldrushExtractionLoop`.

## Live Runtime Sync

The main GoldRush runtime mirrors live local actions into the bridge:

```txt
mine complete -> pickup gold -> complete mine-seam
damage taken -> increase ambush-pressure -> spend lost cargo
cashout complete -> complete carry-gold -> deliver gold -> complete cashout-site
threat hit -> reduce ambush-pressure
```

`goldrushScenario.snapshot()` exposes `protoKitBridge`, and `window.GoldRushHost.getState().protoKitBridge` carries the same snapshot for browser proof. The bridge remains a descriptor/proof adapter; it is not the authority for GoldRush scoring or receipts.

## Safety Rule

The imported ProtoKit stack is hosted in an isolated NexusRealtime runtime. Directly installing and ticking the imported composite stack inside the main GoldRush runtime currently overflows inside the imported runtime stack, so the bridge uses the ProtoKit facades as a controlled adapter source and proves the main GoldRush runtime can still tick.

## Validation

```txt
node tools/validation/validate-goldrush-protokit-bridge.mjs
```

The validator proves pickup, checkpoint completion, pressure adjustment, delivery, serializable descriptors, dependency loading, one main GoldRush runtime tick with the bridge installed, and a live runtime mine -> cashout sequence reflected in the ProtoKit route/cargo snapshot.
