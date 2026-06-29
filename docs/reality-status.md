# Gold Rush Reality Status

## Purpose

`engine.n.goldrushReality` exposes what is real, what is prototype, and what is blocked on cloud-side source transfer. This prevents procedural placeholders from being mistaken for final legacy parity.

## Current Domain Truth

| Domain | Status | Current truth |
| --- | --- | --- |
| Source Discovery | `real-local` | Two legacy source projects are represented in the browser-safe legacy manifest. |
| Legacy Assets | `blocked-cloud-import` | Runtime model, prop, and scene slots are placeholders with no promoted legacy runtime paths. |
| Audio/Music | `blocked-cloud-import` | Music and SFX slots are placeholder IDs; current browser audio is procedural fallback. |
| Character/Rig | `prototype` | The visible character is procedural Three.js geometry, not a promoted rigged character. |
| Animation Clips | `prototype` | Animation state descriptors exist, but authored clips are placeholders. |
| Network/Rooms | `real-local` | Incremental 50-player partition orchestration is implemented and validated locally. |
| Peer Party Lobby | `real-local` | PeerJS party-code room scaffolding exists for a four-player lobby. |
| NexusRealtime Runtime | `real-local` | Gold Rush domains install as `engine.n.goldrush*` kit APIs. |
| Scene Kit Loading | `real-local` | Scene kit groups activate with runtime receipts and dynamic renderer imports when app state includes loader receipts. |
| Terrain/Collider | `real-local` | Terrain height, raycast placement, and Cannon heightfield metadata are implemented locally. |
| Combat | `prototype` | Combat changes camera/audio/state and applies damage receipts, but lacks real aiming, projectiles, hit detection, and weapon assets. |
| Mining/Gold | `prototype` | Mining/cashout is kit-owned state, but not physical interaction with world nodes and cargo visuals. |
| Train Loading Scene | `prototype` | The loading yard and train handoff exist, but multiplayer sync and boarding polish are incomplete. |
| Build/Deploy | `pending-external-proof` | Local build succeeds, but current branch/pages deployment proof still needs external verification. |

## Runtime Contract

```js
window.GoldRushHost.getState().realityStatus
window.GoldRushHost.getState().realityValidation
engine.n.goldrushReality.snapshot()
engine.n.goldrushReality.validate()
```

The app passes `sceneKitLoader.snapshot()` into `goldrushReality` so scene-kit loading is marked real only when activation receipts and loaded modules are present.

## Validation

```bash
node tools/validation/validate-reality-status.mjs
npm run check
```

The validator fails if:

- placeholder slots exist but asset/audio cloud blockers are not explicit.
- procedural character or animation placeholders are claimed as final assets.
- network and terrain collider work regress from `real-local`.
- app state stops exposing `realityStatus` or `realityValidation`.
