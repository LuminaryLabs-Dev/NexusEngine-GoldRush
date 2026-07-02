# Evidence Matrix

Status: active docs-only

| ID | Requirement | Current evidence summary | Current status |
| --- | --- | --- | --- |
| 001 | Unified Gold Rush Identity | Goal packet 01 requires one unified Gold Rush identity and both old Unity versions represented in the browser game. README says legacy source intake and legacy modes exist as browser-safe APIs. | incomplete |
| 002 | NexusRealtime Kit Architecture | README and lessons matrix identify NexusRealtime-style domain kits, generic incubator kits, ProtoKit bridge, and GoldRush custom kits as the architecture. | partial |
| 003 | Approved Legacy Assets Runtime | Goal packet 03 defines raw, sanitized, review, provenance, approval, and promotion gates. Memory and lessons say candidates are not runtime assets. | incomplete |
| 004 | Actual Audio Music Promotion | Goal packet 03 preserves cue slots and requires actual legacy audio only after approval. Current notes allow semantic cue-state and short procedural fallbacks. | incomplete |
| 005 | Authored Desert Map Source | AAA roadmap, authored terrain spec, and implementation batch 001 define the need for source fixtures, height, masks, LOD, collider parity, raycast placement, and zones. | planned-not-implemented |
| 006 | Terrain Collider And Grounding | Lessons matrix says collider/raycast proof exists, but authored map readability still needs a shared source. | partial |
| 007 | Third Person Camera And Controls | Goal and lessons require camera-relative WASD, mouse look, and one camera authority. Current proof direction says camera stability exists for current slices. | partial |
| 008 | Character Rig Animation Fidelity | Goal packet 01 says character rig and animations must be game-readable. Lessons mention toon-shaded direction and character fidelity gap. | incomplete |
| 009 | Player Facing Mining Cashout Loop | Goal packet 02 says player-loop readiness tracks resource cue, mine hold, cargo visual, cashout cue, cashout hold, and receipt-backed results. | partial |
| 010 | Combat Playable And Legible | Goal packet 02 says combat readiness and combat route guidance exist. Lessons say production combat still needs authored cover, weapons, hit feedback, and threat readability. | incomplete |
| 011 | Extraction Stakes Results | Goal packets require cashout, score receipts, results, and replay summary. Wave 002 identifies extraction stakes/loss as a high gap. | partial |
| 012 | Sixty Player Scale Readiness | README targets 2-100 players. Goal requires 60 people plus single-player staging. Wave 002 marks 60-player product pillar and staging gaps critical. | incomplete |
| 013 | Single Player Staging Environment | Goal requires full staging environment to play and test single player. Wave 002 atomic layer defines bot roles and staging entry atoms. | planned-not-implemented |
| 014 | Battle Royale Zone Pacing | Wave 002 identifies zone pressure pacing from PUBG as critical and breaks it into atomic timing, density, route, and feedback packets. | planned-partial |
| 015 | Toon AAA Visual Fidelity | Lessons say current visual direction is toon-shaded high-fidelity wild west and free candidates are source candidates only. | incomplete |
| 016 | Public Build Deploy Proof | Goal packet 04 defines Build branch Pages deploy and regular local/public proof path. | partial |
| 017 | Local Public Human View Proof | Goal packet 04 requires Playwright screenshots, videos for motion, browser doctor, retained reports, and evidence standard. | partial |
| 018 | Versioning Restart Discipline | Agent docs, lessons, change log, roadmap, simulations, audits, and continuous waves exist. Wave 002 includes restart/versioning atoms. | partial |
| 019 | Market Player AAA Gap Coverage | AAA roadmap, wave 002, and source references cover Apex, PUBG, Hunt, and game-engine feature surfaces. | planned-partial |
| 020 | Final Completion Audit Gate | The active objective requires completion be proven requirement-by-requirement against current state. | open |

## Evidence Classes

- Current repo file proving the contract.
- Current command output proving validation.
- Current retained local/public report proving browser behavior.
- Current screenshot or video proving human-view behavior.
- Current Build workflow and public URL proof when deploy is part of the requirement.

## Anti-Claim Rule

If evidence is stale, indirect, too narrow, or only planned, treat the requirement as incomplete.
