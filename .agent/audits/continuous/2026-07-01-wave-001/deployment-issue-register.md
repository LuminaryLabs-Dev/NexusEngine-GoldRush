# Continuous Audit Wave 001 Deployment Issue Register

Status: active docs-only

| Packet | Area | Deployment issue | State |
| --- | --- | --- | --- |
| 001 | Map source drift | Public build can ship older terrain data than local if Build lags. | open |
| 001 | Map source drift | Static asset base path can break future terrain chunk fetches. | open |
| 001 | Map source drift | Heavy mesh data can pass local but exceed Pages/browser memory budgets. | open |
| 002 | Terrain collider and LOD drift | WebGL precision or devicePixelRatio changes can reveal seams only in public/browser proof. | open |
| 002 | Terrain collider and LOD drift | Different browser timing can expose alternating-frame LOD churn. | open |
| 003 | Render and art readability drift | Low-end browser renders materials differently and collapses contrast. | open |
| 003 | Render and art readability drift | Public screenshots are stale compared with local art pass. | open |
| 004 | Camera and control authority drift | Browser focus and pointer lock differ between local and public Pages. | open |
| 004 | Camera and control authority drift | Video proof may be needed because screenshots miss oscillation. | open |
| 005 | Interaction tactility fakeout | Public smoke can pass through proof-only helper APIs if not blocked. | open |
| 005 | Interaction tactility fakeout | Mobile or non-pointer input may not trigger hold/cancel timing correctly. | open |
| 006 | Combat encounter readability gap | Network delay may make hit/cover state look unfair. | open |
| 006 | Combat encounter readability gap | Low frame rate can hide telegraph frames. | open |
| 007 | Network 60-player scale fakeout | PeerJS/browser relay behavior differs across public origins. | open |
| 007 | Network 60-player scale fakeout | Static Pages deploy cannot imply hosted authoritative backend. | open |
| 008 | Single-player staging gap | Public staging mode can expose debug-only controls if not gated. | open |
| 008 | Single-player staging gap | Retained reports must be sanitized by default. | open |
| 009 | Asset approval and runtime drift | GitHub Pages may publish any file under public if promotion gates are bypassed. | open |
| 009 | Asset approval and runtime drift | Build artifacts can accidentally copy reports or source candidates. | open |
| 010 | Audio, atmosphere, and feedback gap | Autoplay and user gesture rules differ by browser. | open |
| 010 | Audio, atmosphere, and feedback gap | Public proof may need interaction before audio context resumes. | open |
| 011 | Public deploy proof drift | Pages is static and may lag CI completion. | open |
| 011 | Public deploy proof drift | Browser cache and base path issues can appear only on public URL. | open |
| 012 | Report hygiene and restart drift | Generated report folders can accidentally be staged or published. | open |
| 012 | Report hygiene and restart drift | Docs can oversell state relative to public proof. | open |
