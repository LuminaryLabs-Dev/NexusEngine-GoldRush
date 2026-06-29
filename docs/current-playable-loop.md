# Current Playable Loop

## Purpose

The current browser build proves the first Gold Rush loop without legacy assets:

```txt
Generate Match Rooms
-> Mine Gold
-> Ambush
-> Cash Out
```

## Proof Contract

The loop must keep these facts true:

- `72` players generate `2` room shards.
- NexusRealtime installs `8` Gold Rush Domain Service Kits.
- `Mine Gold` changes player cargo from `0` to `35`.
- `Ambush` switches to combat perspective and reduces carried gold from `35` to `24`.
- `Cash Out` banks `24`, clears carried gold to `0`, and returns to exploration perspective.

The authoritative local check is:

```bash
npm run check
```

The human-view proof is the public page:

```txt
https://luminarylabs-dev.github.io/NexusEngine-GoldRush/
```

## Legacy Mapping

- Modern Gold Rush assets will fill visual/world slots.
- Old Gold Rush gameplay informs gold-as-score, gold-as-risk, combat perspective, and cashout.
- NexusRealtime owns domain state through `engine.n.goldrush*` APIs.
- Three.js consumes snapshots and renders descriptors only.
