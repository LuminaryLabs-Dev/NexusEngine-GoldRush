# Gold Rush Scene Sites

Gold Rush now treats major scenes as separate sites so each site can load a different kit group.

## Site Map

| Site | Screen | Kit groups | Purpose |
| --- | --- | --- | --- |
| `site.start` | `start` | `title-audio` | Title entry without gameplay kits mounted. |
| `site.lobby-character` | `lobby` | `peer-party-room`, `three-lobby-character`, `room-selection` | Party setup plus draggable Three.js character preview. |
| `site.loading-yard` | `loading` | `loading-yard-terrain`, `party-presence`, `walkable-player`, `train-departure` | Small pre-match train yard where players walk to the train. |
| `site.gold-field` | `run` | `goldrush-runtime`, `procedural-terrain`, `object-micro-kits`, `network-orchestration` | Main NexusRealtime gold field runtime. |

## Flow

```txt
start -> lobby-character -> loading-yard -> gold-field
```

The lobby `Start` action does not jump straight into the match. It broadcasts the PeerJS party start, enters the loading-yard site, lets the local player walk to the train, plays the train departure, then hands off to the 20-player gold-field runtime.

## Runtime Contract

`createGoldRushSceneKitLoader()` activates kit groups when the active screen changes. `window.GoldRushHost.getState().sceneKitLoader` exposes activation receipts, loaded modules, and active groups for browser validation. This keeps the start screen, party lobby, loading yard, and full gold field from loading the same kit stack.

## Validation

`tools/validation/validate-scene-sites.mjs` checks that every site has a unique id, a screen, kit groups, dynamic renderer imports, activation receipts, and the required render handoff code.
