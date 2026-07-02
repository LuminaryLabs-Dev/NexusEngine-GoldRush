# Source Reference Matrix

Status: active

| Source | URL | Relevant signal | GoldRush use |
| --- | --- | --- | --- |
| apex-modes | [Apex Legends game modes](https://help.ea.com/en/articles/apex-legends/game-modes/) | Bot Royale uses humans plus bot squads up to 60 players, Private Match supports up to 60 players and observers, and Training/Firing Range are separated practice contexts. | Separate practice, bot-fill, private proof, and future live modes. Bot proof can exercise pacing and pressure, but it must label what is simulated. |
| pubg-overview | [PUBG overview](https://pubg.com/en/game-info/overview) | Battle royale pressure is built from land, loot, survive, map choice, drop choice, and a shrinking battleground. | Bots must exercise route choice, resource pickup, survival pressure, and zone movement instead of only standing as targets. |
| pubg-custom-ai | [PUBG custom match AI settings](https://pubg.com/en/news/8476) | Custom matches can enable AI, tune AI damage, fill lobbies with bots, start with one team when AI is enabled, and still show results. | GoldRush staging should allow single-player runs with bot-filled pressure while preserving result labels and live-proof boundaries. |
| fortnite-fill | [Fortnite fill and mode toggles](https://www.epicgames.com/help/c-202300000001636/c-202300000001721/how-to-toggle-ranked-and-team-fill-modes-in-fortnite-a202300000014894) | Mode, ranked, team fill, and Solo/Duo/Trio/Squad options are player-facing choices near the Play action. | Party, fill, bot-fill, staging, and no-fill should become clean mode contracts instead of hidden proof switches. |
| github-game-engines | [GitHub game engines collection](https://github.com/collections/game-engines) | Common engines and frameworks expose rendering, scene, platform, tooling, collaboration, and runtime surfaces. | Do not build a general engine, but use the list as a missing-surface checklist for AI, scene, proof, content, runtime, and tools. |
| github-js-game-engines | [GitHub JavaScript game engines collection](https://github.com/collections/javascript-game-engines) | Web game frameworks emphasize browser rendering, WebGL, WebGPU, glTF, layout, and platform reach. | Browser proof should track rendering, input, physics, network, asset loading, and report hygiene separately. |

## Research Read

The references point toward a clear split: practice and staging can be bot-heavy, private/custom modes can support large match shapes, and player-facing fill/mode settings should be explicit. GoldRush should borrow those product boundaries without building a generic engine or claiming a finished live service.
