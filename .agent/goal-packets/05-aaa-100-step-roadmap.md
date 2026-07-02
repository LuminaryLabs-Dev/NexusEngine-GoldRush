# AAA 100-Step Roadmap Goal

Status: active

## Purpose

Track the docs-only planning layer for turning GoldRush from the current proven prototype into a high-fidelity wild-west extraction battle royale.

## Primary Artifacts

- `docs/aaa-production-roadmap/README.md`
- `.agent/audits/completion/2026-07-01-goal-completion-gap/`
- `.agent/audits/aaa-current-state-audit-2026-07-01.md`
- `.agent/research/aaa-100-step-research-index-2026-07-01.md`
- `.agent/research/aaa-100/`
- `.agent/research/aaa-100/authored-map-atomic-matrix.md`
- `.agent/research/aaa-100/authored-map-atomic-research-matrix.md`
- `.agent/research/aaa-100/authored-terrain-kit-spec/`
- `.agent/simulations/aaa-100/`
- `.agent/audits/aaa-100-step-audits/`
- `.agent/audits/continuous/2026-07-01-wave-001/`
- `.agent/audits/aaa-100-step-simulation-audit-2026-07-01.md`
- `.agent/version-rebuild-loop/`

## Current Diagnosis

The project is plateauing because the core kit and proof scaffolding is ahead of the content/art pipeline. The next production move is a drawn/authored desert map source with LOD, collider parity, raycast placement, and object protokit consumers.

That move is now broken into atomic authored-map planning packets so implementation can proceed from one named source-data concern at a time.

Each authored-map atom now has four separate research packets so source references, domain implications, data/proof requirements, and edge cases can be audited independently before runtime work.

All 100 roadmap steps now also have paired simulation and audit packets. The simulation packet rehearses implementation and deployment risks; the audit packet defines the hardening questions and evidence needed before a row can move toward resolved.

The first continuous audit wave now tracks cross-domain drift that can keep the project plateaued even when individual packets look green: authored map drift, collider/LOD drift, camera authority, interaction fakeout, combat readability, 60-player proof, staging, asset approval, audio feedback, deploy drift, and report hygiene.

The authored terrain kit spec turns that diagnosis into concrete docs-only contracts for `n:world:authored-terrain-mesh` and `n:goldrush:desert-world-map`, with source schema, LOD, collider parity, placement/raycast, gameplay zones, consumer flow, readiness, failure, and proof/deploy plans.

Implementation batch 001 now breaks the first terrain coding phase into source fixture, revision, bounds, height, slope, masks, chunks, raycasts, anchors, LOD, collider, consumer, validation, human-view, public deploy, sanitization, restart, open-question, and stop-condition packets.

The second continuous audit wave now tracks reference parity against current battle-royale, extraction, and game-architecture sources so the project does not become only a terrain demo, only a kit demo, or only a local proof harness.

Wave 002 now has an atomic layer with 72 audit atoms and 72 paired research notes. These translate broad reference gaps into implementation-sized kit/proof requirements.

The completion gap audit now maps the full active goal into 20 evidence requirements. It explicitly keeps the goal open until approved assets/audio, authored terrain, character fidelity, natural combat, 60-player staging, single-player staging, battle-royale pacing, toon fidelity, and full local/public proof are proven from current evidence.

The completion audit now also has 120 evidence atoms and 120 paired research notes. Each of the 20 completion requirements is split into six proof layers: contract surface, current evidence, missing proof, implementation slice, human-view proof, and public deploy proof.

The minute interaction atlas now breaks the full title -> lobby -> train -> gold field -> mine -> carry -> pressure -> cashout -> results loop into 120 player-facing micro-actions with owner kits and paired research notes.

The plateau breakthrough terrain kit now answers the current production question directly: the game is flattening out because procedural systems are ahead of source-authored map shape, so the next terrain implementation must start with a drawn source revision and prove LOD, collider, raycast placement, asset anchors, gameplay masks, route readability, and public proof from that same source.

The source artboard production workbook now turns that into a literal map-authoring checklist: scale, layers, composition, height/masks, LOD extraction, asset stamps, gameplay annotations, proof shots, and implementation stop conditions must exist before future terrain code replaces the live map.

The source artboard workbook now has 48 atomic implementation packets plus paired research, simulations, and audits, so future terrain code can start from one artboard sheet concern and prove source, consumer, player-view, and restart evidence.

The source artboard fixture preflight now defines `goldrush.desert.artboard.fixture.001` as the first tiny implementation gate. Future terrain code should start by validating this source fixture, then proving one render, collider, placement, gameplay, and human-view consumer against the same revision before expanding map scale or visual density.

The fixture preflight now has a 24-atom implementation runway with paired research, simulations, and audits. This makes the first future terrain code phase atomic enough to start with one failing validator and one consumer proof instead of another broad terrain pass.

Atom 001 now has a source-id and revision micro-runway. Future terrain implementation should start there before source fixture validator code so fixture id, revision id, source hash inputs, consumer echo, stale-proof flags, and restart packet linkage are proven before renderer, collider, placement, gameplay, or public proof consumers expand.

Atom 002 now has a bounds, scale, and origin micro-runway. Future terrain implementation should prove coordinate system, unit scale, playable bounds, origin anchor, cell spacing, vertical range, boundary query policy, traversal distances, LOD/partition scale echo, physics/render parity, and scale restart policy before any large-map, terrain-collider, object-placement, gameplay-zone, or 60-player staging claim.

Atom 003 now has a height sample micro-runway. Future terrain implementation should prove finite source-owned height samples, normalization, offsets, cell addressing, interpolation, edge policy, public sampleHeight API shape, named proof points, render/collider/movement parity, negative fixture cases, and height stale-proof behavior before renderer, collider, raycast, movement, placement, gameplay, or public proof consumers claim terrain correctness.

Atom 004 now has a normal and slope micro-runway. Future terrain implementation should prove normal vector shape, normal coordinate space, slope value domain, slope class taxonomy, walkable thresholds, normal derivation source, gradient sample neighborhood, public sampleGround API shape, movement parity, placement parity, negative fixture cases, and normal/slope stale-proof behavior before movement, placement, route readability, or terrain-footing proof expands.

Atom 005 now has a material and biome mask micro-runway. Future terrain implementation should prove material mask schema, biome mask schema, closed material and biome tag taxonomies, mask weight domain, layer blend policy, render material parity, audio/VFX surface parity, placement biome parity, gameplay surface parity, negative fixture cases, and material/biome stale-proof behavior before visuals, cues, VFX, object placement, gameplay zones, or public proof claim authored terrain surface identity.

Atom 006 now has a walkable and blocker mask micro-runway. Future terrain implementation should prove walkable mask schema, blocker mask schema, closed walkability and blocker taxonomies, slope/walkability linkage, hole/overhang policy, movement rejection parity, placement rejection parity, AI route/staging parity, edge transition policy, negative fixture cases, and walkable/blocker stale-proof behavior before movement, placement, AI staging, collider, camera, or public proof claim terrain navigation correctness.

Atom 007 now has a route annotation micro-runway. Future terrain implementation should prove primary route schema, alternate route schema, branch/return lane schema, route node and segment ids, route corridor budgets, route cost/risk tags, getZoneAt route queries, named route proof points, player guidance parity, AI staging route parity, negative fixture cases, and route stale-proof behavior before player guidance, bot routing, extraction paths, combat pressure, or public proof claim authored traversal correctness.

Atom 008 now has a mine and gold annotation micro-runway. Future terrain implementation should prove mine site schema, gold seam schema, resource node ids, yield tiers, mine approach/workspace, resource readability tags, mine interaction anchors, renderer placement echo, mining hold-action echo, cargo/receipt provenance, negative fixture cases, and resource stale-proof behavior before mining markers, gold visuals, hold actions, cargo, scoring, replay, bot behavior, or public proof claim authored resource gameplay correctness.

Atom 009 now has a cover and pressure annotation micro-runway. Future terrain implementation should prove cover pocket schema, threat lane schema, pressure seed schema, sightline/occlusion tags, pressure route linkage, cover counterplay, combat proof points, pressure query API shape, renderer threat echo, combat-loop consumer echo, negative fixture cases, and combat stale-proof behavior before threat telegraphs, cover guidance, ambush pressure, combat receipts, replay, bot behavior, or public proof claim authored combat readability correctness.

Atom 010 now has a cashout and extraction annotation micro-runway. Future terrain implementation should prove cashout site schema, extraction radius schema, deposit anchor contract, return route linkage, risk/contest tags, readability tags, cashout query API shape, renderer marker parity, extraction hold parity, receipt/results parity, negative fixture cases, and extraction stale-proof behavior before cashout markers, extraction holds, receipts, scoring, replay, bot behavior, or public proof claim authored extraction destination correctness.

Atom 011 now has a rail and train reference micro-runway. Future terrain implementation should prove rail spline schema, train stop/platform anchors, loading-yard map edge links, train path sampling, boarding side labels, train motion state, rail/terrain parity, rail prop placement, camera handoff, train audio cue provenance, negative fixture cases, and rail stale-proof behavior before train arrival, boarding, departure, camera follow, audio cues, scene handoff, simulator proof, or public proof claim authored train correctness.

The full roadmap now runs through the version rebuild loop. A roadmap atom is not implementation-ready until it is attached to the newest version packet with a continue-or-increment decision, owner domain, kit contract, data contract, validator, player-facing outcome, and proof boundary. If the newest version is stuck, fake, helper-heavy, overcomplicated, stale, or carrying bad assumptions, create the next version as a ground-up rebuild attempt and carry forward only validated parts, contracts, lessons, design docs, and roadmap goals.

## Non-Negotiables

- Do not make GoldRush into a general-purpose game engine.
- Do not promote raw or sanitized assets into runtime without approval.
- Do not treat procedural scatter as AAA content unless each object is kit-owned, readable, and placed from the authored map data.
- Do not claim 60-player readiness from single-player proof; staging/simulation must label what is simulated.
- Do not resolve roadmap rows only from technical green checks when the matching reference-parity packet still lacks player-facing proof.
- Do not write runtime implementation while this packet is in docs-only planning mode.
- Do not implement a roadmap atom outside the newest version packet.
- Do not create `v0.0.2` until `v0.0.1` has a clear continue-or-increment decision.
- Do not carry helper-only, debug-only, renderer-only, stale, or fake proof forward.

## Next Code Phase Candidate

Before code, read `.agent/version-rebuild-loop/current-version.md`, audit the newest version packet, and decide continue-or-increment.

If continuing the newest version, attach exactly one roadmap atom to that version packet before editing code.

If incrementing, create the next version packet first, then rebuild from validated parts, validated contracts, current lessons, current design docs, and current roadmap goals only.

When implementation is allowed, start with `n:goldrush:authored-desert-map` and its research packets:

```txt
.agent/research/aaa-100/021-terrain-intention-map.md
.agent/research/aaa-100/022-top-down-terrain-plate.md
.agent/research/aaa-100/023-height-mask-data-model.md
.agent/research/aaa-100/024-lod-ring-contract.md
.agent/research/aaa-100/026-collider-parity.md
.agent/research/aaa-100/040-prop-protokit-library.md
```

Then read `.agent/research/aaa-100/authored-terrain-kit-spec/README.md` and implement the neutral `n:world:authored-terrain-mesh` source fixture before renderer, collider, prop, or gameplay consumers.

Use `.agent/research/aaa-100/authored-terrain-kit-spec/implementation-batch-001/batch-matrix.md` as the immediate coding order once implementation is allowed.

For any roadmap row affected by battle-royale or extraction reference parity, also read `.agent/audits/continuous/2026-07-01-wave-002/atomic/atomic-matrix.md` and the matching research note before implementation.

Before claiming broad milestone completion, read `.agent/audits/completion/2026-07-01-goal-completion-gap/requirement-matrix.md` and update only the relevant requirement packet with current proof.

Then read `.agent/audits/completion/2026-07-01-goal-completion-gap/evidence-atoms/atom-matrix.md` and resolve the matching evidence atoms before changing a requirement status.

For player-facing interaction work, read `.agent/research/aaa-100/minute-interactions/interaction-matrix.md` and the matching research note before implementation.

For terrain readability or map-density work, read `.agent/research/aaa-100/drawn-terrain-source/plateau-breakthrough-terrain-kit/README.md` and the matching atom/research/simulation/audit packet before implementation.

Before terrain fixture implementation, also read `.agent/research/aaa-100/drawn-terrain-source/source-artboard-production-workbook/README.md` and `.agent/research/aaa-100/drawn-terrain-source/source-artboard-production-workbook/artboard-matrix.md`.

Then choose one source-artboard atom from `.agent/research/aaa-100/drawn-terrain-source/source-artboard-production-workbook/atomic-matrix.md` and read its matching research, simulation, and audit before implementation.

Finally, read `.agent/research/aaa-100/drawn-terrain-source/source-artboard-production-workbook/fixture-preflight-001/README.md` and implement `goldrush.desert.artboard.fixture.001` as the first source-fixture validator gate before replacing any live terrain.

Then choose one row from `.agent/research/aaa-100/drawn-terrain-source/source-artboard-production-workbook/fixture-preflight-001/atomic-matrix.md` and read the matching research, simulation, and audit packet before making code changes.

If the chosen row is atom 001, first read `.agent/research/aaa-100/drawn-terrain-source/source-artboard-production-workbook/fixture-preflight-001/micro-001-source-id-and-revision/README.md` and its micro, research, simulation, and audit matrices.

If the chosen row is atom 002, first read `.agent/research/aaa-100/drawn-terrain-source/source-artboard-production-workbook/fixture-preflight-001/micro-002-bounds-scale-and-origin/README.md` and its micro, research, simulation, and audit matrices.

If the chosen row is atom 003, first read `.agent/research/aaa-100/drawn-terrain-source/source-artboard-production-workbook/fixture-preflight-001/micro-003-height-sample-contract/README.md` and its micro, research, simulation, and audit matrices.

If the chosen row is atom 004, first read `.agent/research/aaa-100/drawn-terrain-source/source-artboard-production-workbook/fixture-preflight-001/micro-004-normal-and-slope-contract/README.md` and its micro, research, simulation, and audit matrices.

If the chosen row is atom 005, first read `.agent/research/aaa-100/drawn-terrain-source/source-artboard-production-workbook/fixture-preflight-001/micro-005-material-and-biome-mask-contract/README.md` and its micro, research, simulation, and audit matrices.

If the chosen row is atom 006, first read `.agent/research/aaa-100/drawn-terrain-source/source-artboard-production-workbook/fixture-preflight-001/micro-006-walkable-blocker-mask-contract/README.md` and its micro, research, simulation, and audit matrices.

If the chosen row is atom 007, first read `.agent/research/aaa-100/drawn-terrain-source/source-artboard-production-workbook/fixture-preflight-001/micro-007-route-annotation-contract/README.md` and its micro, research, simulation, and audit matrices.

If the chosen row is atom 008, first read `.agent/research/aaa-100/drawn-terrain-source/source-artboard-production-workbook/fixture-preflight-001/micro-008-mine-and-gold-annotation-contract/README.md` and its micro, research, simulation, and audit matrices.

If the chosen row is atom 009, first read `.agent/research/aaa-100/drawn-terrain-source/source-artboard-production-workbook/fixture-preflight-001/micro-009-cover-and-pressure-annotation-contract/README.md` and its micro, research, simulation, and audit matrices.

If the chosen row is atom 010, first read `.agent/research/aaa-100/drawn-terrain-source/source-artboard-production-workbook/fixture-preflight-001/micro-010-cashout-and-extraction-annotation-contract/README.md` and its micro, research, simulation, and audit matrices.

If the chosen row is atom 011, first read `.agent/research/aaa-100/drawn-terrain-source/source-artboard-production-workbook/fixture-preflight-001/micro-011-rail-and-train-reference-contract/README.md` and its micro, research, simulation, and audit matrices.
