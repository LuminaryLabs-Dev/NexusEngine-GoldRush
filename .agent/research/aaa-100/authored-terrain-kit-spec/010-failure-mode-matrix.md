# Authored Terrain Failure Mode Matrix

Status: active docs-only

## Purpose

Track the failures this kit spec is designed to prevent.

| Failure | Likely cause | Detection | Owner |
| --- | --- | --- | --- |
| player floats | collider sample differs from visible/source height | ground mismatch samples and screenshot | physics terrain parity |
| player pulses | LOD or transition swaps source per frame | multi-frame motion/video proof | LOD plus camera authority |
| map feels small | world bounds and landmarks are not authored | player-view traversal screenshots | desert world map |
| terrain is flat/noisy | procedural density replaces authored form | art readability review | terrain source plate |
| gold feels arbitrary | gold zones not tied to terrain risk | route/economy proof | gold zone placement |
| towns feel decorative | town pads lack interaction/route/cover data | player action and route proof | town/mine layout |
| extraction is hidden | extraction mask lacks visibility/sightline | human-view extraction screenshot | extraction site layout |
| cover lies | cover visual lacks physics/query support | cover route and collision proof | combat cover system |
| train clips or floats | rail spline ignores terrain sample | train path/collider proof | path and rail splines |
| public build differs | Build branch or Pages cache stale | public smoke and commit evidence | deploy preview policy |
