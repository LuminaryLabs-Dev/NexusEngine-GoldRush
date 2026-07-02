# Continuous Audit Wave 001 Edge Case Matrix

Status: active docs-only

| Packet | Area | Edge case | State |
| --- | --- | --- | --- |
| 001 | Map source drift | Player stands on one band while visual mesh draws another. | open |
| 001 | Map source drift | LOD seam moves the ground under the player during motion. | open |
| 001 | Map source drift | Gold object raycasts use a different height sample than character grounding. | open |
| 001 | Map source drift | Town pads float or cut into ridges after terrain scale changes. | open |
| 001 | Map source drift | Extraction site is technically placed but hidden behind unreadable terrain. | open |
| 002 | Terrain collider and LOD drift | Every-other-frame height sample flips between coarse and fine bands. | open |
| 002 | Terrain collider and LOD drift | Collider blocker is taller than visible mountain. | open |
| 002 | Terrain collider and LOD drift | Skirt geometry hides gaps but physics still has holes. | open |
| 002 | Terrain collider and LOD drift | Raycast down starts from the wrong local/world coordinate frame. | open |
| 002 | Terrain collider and LOD drift | Slope limit rejects valid walking paths around the central mountain. | open |
| 003 | Render and art readability drift | Clutter hides gold or cover cues. | open |
| 003 | Render and art readability drift | Mine, town, and extraction props share one unreadable material role. | open |
| 003 | Render and art readability drift | Large terrain makes objectives too small to read. | open |
| 003 | Render and art readability drift | Object markers compensate for poor asset silhouettes. | open |
| 003 | Render and art readability drift | Generated props look numerous but not authored. | open |
| 004 | Camera and control authority drift | Transition reconfig keeps applying after gameplay starts. | open |
| 004 | Camera and control authority drift | Proof helper sets player position while camera-follow also smooths from old target. | open |
| 004 | Camera and control authority drift | Combat camera overrides exploration camera without resetting shoulder offset. | open |
| 004 | Camera and control authority drift | Mouse-lock loss changes yaw but not movement basis. | open |
| 004 | Camera and control authority drift | Character rig rotation and camera yaw disagree. | open |
| 005 | Interaction tactility fakeout | Interact key mines wrong object because nearest affordance is unclear. | open |
| 005 | Interaction tactility fakeout | Hold progress continues after player walks away. | open |
| 005 | Interaction tactility fakeout | Cargo changes score but not movement, posture, sound, or risk. | open |
| 005 | Interaction tactility fakeout | Cashout starts while threat state says it should be interrupted. | open |
| 005 | Interaction tactility fakeout | Tutorial text replaces readable world feedback. | open |
| 006 | Combat encounter readability gap | Threat spawns behind unreadable terrain. | open |
| 006 | Combat encounter readability gap | Cover looks solid but physics/query says it is not cover. | open |
| 006 | Combat encounter readability gap | Hit feedback is invisible at long range. | open |
| 006 | Combat encounter readability gap | Solo staging gets stuck in downed/revive rules designed for squads. | open |
| 006 | Combat encounter readability gap | Zone pressure and extraction timer conflict unfairly. | open |
| 007 | Network 60-player scale fakeout | Party leader leaves during train handoff. | open |
| 007 | Network 60-player scale fakeout | Player 51 creates a partition but handoff receipts assign stale room ids. | open |
| 007 | Network 60-player scale fakeout | Rejoin duplicates carried gold or extraction receipts. | open |
| 007 | Network 60-player scale fakeout | Bot fill hides network payload pressure. | open |
| 007 | Network 60-player scale fakeout | Anti-cheat sanity checks reject valid laggy input. | open |
| 008 | Single-player staging gap | Staging controls leak into production UI. | open |
| 008 | Single-player staging gap | Bots skip terrain/camera constraints humans face. | open |
| 008 | Single-player staging gap | Replay artifact records too much or too little state. | open |
| 008 | Single-player staging gap | Scenario runner duplicates Playwright rather than layering under it. | open |
| 008 | Single-player staging gap | Crash telemetry records local machine paths. | open |
| 009 | Asset approval and runtime drift | Converted GLB scale is wrong but approved anyway. | open |
| 009 | Asset approval and runtime drift | Audio candidate replaces semantic cue before approval. | open |
| 009 | Asset approval and runtime drift | Review-only screenshot gets copied into public assets. | open |
| 009 | Asset approval and runtime drift | Asset manifest contains absolute or raw path. | open |
| 009 | Asset approval and runtime drift | Large model passes import but breaks browser budget. | open |
| 010 | Audio, atmosphere, and feedback gap | Sustained hum returns and masks feedback. | open |
| 010 | Audio, atmosphere, and feedback gap | Train cue state is lost when scene becomes results. | open |
| 010 | Audio, atmosphere, and feedback gap | Threat audio fires without visible threat. | open |
| 010 | Audio, atmosphere, and feedback gap | Cashout progress has visual proof but no audible tension. | open |
| 010 | Audio, atmosphere, and feedback gap | Multiple loops overlap after scene reset. | open |
| 011 | Public deploy proof drift | Build branch is green but default branch docs describe newer behavior. | open |
| 011 | Public deploy proof drift | Pages cache serves stale JS after a deploy. | open |
| 011 | Public deploy proof drift | Smoke proof uses localhost but is summarized as public. | open |
| 011 | Public deploy proof drift | Workflow passes build but not natural player route. | open |
| 011 | Public deploy proof drift | Report references source path or account data. | open |
| 012 | Report hygiene and restart drift | Packet says active after implementation replaced it. | open |
| 012 | Report hygiene and restart drift | Two packets define different owners for the same domain. | open |
| 012 | Report hygiene and restart drift | Change log records the work but matrix state never changes. | open |
| 012 | Report hygiene and restart drift | Resolved item keeps being re-audited as open. | open |
| 012 | Report hygiene and restart drift | Path or account data leaks into a shareable report. | open |
