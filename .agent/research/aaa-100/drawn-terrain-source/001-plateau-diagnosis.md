# Plateau Diagnosis

Status: active docs-only
Domain: world / art direction / gameplay readability

## One-Sentence Diagnosis

GoldRush is plateauing because the current world is still a procedural demonstration surface, while the game needs an authored desert map asset with composition, scale, traversal, combat, extraction, and content placement intent.

## What Is Working

| Area | Current value | Why it still matters |
| --- | --- | --- |
| Terrain collider | Grounding and raycast placement have a real owner. | Keeps future terrain work honest. |
| Procedural objects | Object micro-kits can represent thousands of local objects. | Gives the authored map consumers instead of one-off props. |
| Camera/movement | Mouse-look and WASD direction are already important proof targets. | A drawn terrain source can be tested through natural movement. |
| Extraction loop | Mining, cargo, cashout, and results have kit-owned structure. | Map spaces can be validated against actual gameplay needs. |
| Agent docs | The roadmap already names authored terrain as the active cluster. | Future restarts can resume from packets instead of chat memory. |

## What Is Plateauing

| Symptom | Likely root cause | Needed shift |
| --- | --- | --- |
| Terrain still reads flat or synthetic. | Height variation is algorithmic, not authored around landmarks and routes. | Draw top-down form and height intent first. |
| Prop density does not create believability. | Objects lack source masks and environment-space purpose. | Place props from authored map masks and anchors. |
| Mountains can feel arbitrary. | Landmark silhouettes are not derived from a world plate. | Author mesa/ridge/mountain silhouettes as map features. |
| LOD cannot be judged well. | There is no durable source mesh to compare near/mid/far chunks against. | Build LOD from one source with seam fixtures. |
| Combat/extraction spaces still feel staged. | Cover, sightlines, routes, and reward zones are not one map plan. | Put combat lanes and extraction risk into source layers. |
| AAA polish stalls. | The scene lacks content-art source assets, not only code systems. | Create digital terrain and prop-family source assets. |

## Main Lesson

The map must become a digital asset before the renderer can make it feel AAA. The authored source can still be generated, drawn, or tool-produced, but it must be stable data that all kits consume.

## Stop Conditions

Do not proceed to runtime terrain work if:

- render terrain and collider terrain would use different sources
- object placement still depends on scattered ad hoc coordinates
- gold zones are not tied to walkable, visible, reachable terrain
- towns, mines, rails, and extraction sites do not share route data
- LOD chunking has no seam test or source-revision hash
- the first proof would need debug placement instead of natural walking

