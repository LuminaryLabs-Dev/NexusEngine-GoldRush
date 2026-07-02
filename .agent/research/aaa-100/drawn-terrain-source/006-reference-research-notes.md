# Reference Research Notes

Status: active docs-only
Domain: research / product / map design

## Sources Checked

| Source | Relevant observed point | GoldRush implication |
| --- | --- | --- |
| GitHub Game Engines collection, `https://github.com/collections/game-engines` | Mature game frameworks are organized around reusable systems across render, physics, tools, platform, and runtime surfaces. | GoldRush should not make terrain a renderer-only feature; it needs world, physics, render, gameplay, proof, and content contracts. |
| PUBG Blue Zone Revamp, `https://pubg.com/en-asia/news/10280` | PUBG frames zone pressure as a pacing system that shapes movement, positioning, risk, survivor density, and match tempo. | GoldRush terrain must support movement pressure and final-rush/extraction pacing through authored routes, cover, and playable late-game spaces. |
| Apex Legends Overclocked notes, `https://www.ea.com/en/games/apex-legends/apex-legends/news/overclocked-patch-notes` | Apex notes treat movement as a broad toolbox and positioning as central to battle royale play; visibility/readability changes also affect player trust. | GoldRush terrain must be judged through movement feel, line of sight, readable cover, and over-the-shoulder player view, not only top-down layout. |

## Research Takeaways

| Topic | Takeaway | Packet impact |
| --- | --- | --- |
| Engine architecture | Use system boundaries as idea sources, not as a reason to build a full engine. | Keep source terrain neutral; keep GoldRush map orchestration custom. |
| Battle royale pacing | The map must control rhythm, not just provide area. | Add route, pressure, cover, and extraction masks to the source. |
| Movement and positioning | Player movement must reveal why the map is fun. | Validate with natural walking, mouse-look, and motion proof. |
| Readability | Player trust depends on what they can see and infer. | Landmarks, materials, and silhouettes must be authored, not random scatter. |

## Research Gaps

- Need a dedicated extraction-game reference packet for Hunt-style extraction stakes and how map routes support risk/reward.
- Need a terrain-authoring pipeline reference packet for browser-scale terrain chunks and source masks.
- Need an art-direction packet for high-fidelity toon desert materials and asset families.

