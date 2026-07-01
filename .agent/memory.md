# Agent Memory

Status: active

## Durable Notes

- The repo-level durable memory remains `memory.md`.
- Agent-specific operating packets live under `.agent/active/`, `.agent/feedback/`, `.agent/perspectives/`, `.agent/research/`, and `.agent/resolved/`.
- New research packets should end with concrete kit gaps and validator/proof implications, not only design commentary.
- The companion ME ledger is referenced as `<documents>/Me/GoldRush/.agent/goal.md`; do not write absolute local paths into shareable repo docs.
- The local repo is the only edit target. Legacy repos and NexusRealtime-related source repos are cloud/GPT-it inspection or transfer sources unless the user explicitly changes that rule.
- The most important active product loop is title -> lobby -> loading-yard train -> spawn -> move -> mine -> carry -> pressure/combat -> extract -> score -> results.
- Generic incubator kits are promotable only if they avoid GoldRush naming/rules, expose public API/events/snapshot/reset, and have validation.
- GoldRush custom kits own the game-specific composition: scene flow, train loading, player movement, gold carrying, ambush pressure, cashout, scoring, results, and presentation.
- Current proof convention: screenshots for both local and public state; videos only when diagnosing motion/camera/timing.
- Procedural world content is allowed, but each meaningful object should have a stable protokit descriptor and renderer batching should consume those descriptors rather than own rules.
- Major unresolved product debt: approved legacy asset promotion, actual audio/music promotion, character rig/animation fidelity, combat feel, physical object interaction, and human-view extraction flow without direct completion helpers.
- `engine.n.goldrushPlayerDrivenExtractionRoute` owns the five-stage player-driven extraction matrix for resource affordance, mine hold, carry gold, cashout hold, and receipt/results. Use it to separate resolved gameplay from proof-helper debt.
- `engine.n.goldrushPlayerRouteGuidance` owns player route targets, target approach radius, action range, route-leg status, and camera-relative input hints for walking the mine -> carry -> cashout loop without proof placement helpers.
- `engine.n.goldrushPlayerGuidanceCue` owns the player-facing guidance cue for that route. The renderer may draw the arrow/ring, but the gameplay-facing cue role, distance band, target, shape, input, and no-debug-overlay readability policy come from `n:goldrush:player-guidance-cue`.
