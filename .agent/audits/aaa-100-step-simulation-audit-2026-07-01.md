# AAA 100-Step Simulation Audit

Status: active dry-run
Date: 2026-07-01

## Purpose

This is a docs-only implementation simulation for the 100-step roadmap. It asks what would likely happen if each step were implemented, where it would fail, and what gate should catch it.

Detailed per-step overlays now live in:

- `.agent/simulations/aaa-100/`
- `.agent/audits/aaa-100-step-audits/`

Use this file as the phase summary and the per-step overlays as the working packets before implementation resumes.

## Phase Simulation

| Phase | Likely implementation pressure | Main failure mode | Required gate |
| --- | --- | --- | --- |
| 001-010 Governance | Easy to write, easy to ignore | Docs drift away from code | Change-log and proof references |
| 011-020 Research | Can become broad and unfocused | Reference copying instead of GoldRush decisions | Domain owner and kit impact required |
| 021-035 Terrain | High leverage, high risk | New mesh diverges from collider | Terrain parity validator and screenshots |
| 036-045 Assets/audio | High value, blocked by approval | Runtime asset leakage | Sanitized/default asset gates |
| 046-055 Character/control | Player-feel critical | Camera/animation conflict | Human-view movement videos |
| 056-070 Interaction/economy | Core loop | Technical receipts without tactile play | Playwright natural loop proof |
| 071-085 Combat/network | Scale and fairness | Fake 60-player confidence | Simulator, bot, and snapshot proofs |
| 086-095 Staging/release | Iteration speed | Reports leak local paths or proof is too narrow | Report sanitizer and public smoke |
| 096-100 Polish/audit | Long-term quality | Resolved items regress | Continuous audit matrix |

## Step-Level Audit Matrix

| Step | Dry-run risk | Gate |
| --- | --- | --- |
| 001 | Goal written but not enforced | Future packets link back to goal |
| 002 | Baseline becomes stale | Re-run validators before major changes |
| 003 | Branch model conflicts with current deploy | Verify branch and workflow live |
| 004 | Restart packets become prose dumps | Require proof and next-action fields |
| 005 | Ownership matrix hides overloaded kits | Mark split candidates explicitly |
| 006 | Matrix is too broad to update | Keep rows domain-scoped |
| 007 | ADRs duplicate memory | Link decisions to changed files |
| 008 | Public API grows too large | Validate snapshot/public API fields |
| 009 | Gates block momentum | Keep gates tied to risk level |
| 010 | Proof claims too much | Require coverage note per proof |
| 011 | Engine reference causes engine-building | Reject generic engine scope |
| 012 | BR research becomes clone design | Extract needs, not mechanics wholesale |
| 013 | Extraction loop ignores GoldRush identity | Tie extraction to gold/cargo |
| 014 | Visual target remains vague | Require screenshot target and rejection list |
| 015 | Personas do not affect build | Map persona to proof scenario |
| 016 | Interaction list misses cancel/fail states | Include start/update/cancel/complete |
| 017 | Taxonomy becomes paperwork | Use it to choose actual commands |
| 018 | Risk register becomes stale | Update after each release/deploy |
| 019 | Backlog slicing over-parallelizes | Use file/domain locks |
| 020 | Acceptance rubric is subjective | Bind levels to proofs |
| 021 | Map intention overfits current terrain | Start from gameplay spaces |
| 022 | Source plate lacks scale | Define units and origin |
| 023 | Masks diverge from gameplay | Store masks as shared data |
| 024 | LOD popping harms readability | Screenshot motion and seam checks |
| 025 | Chunk seams expose gaps | Add continuity validation |
| 026 | Collider mismatch returns floating | Compare raycast against render samples |
| 027 | Materials become one-note palette | Screenshot color review |
| 028 | Landmarks block routes | Route-around proof |
| 029 | Train path clips terrain | Spline/collider preview |
| 030 | Gold zones become arbitrary | Risk/reward matrix |
| 031 | Town layout lacks gameplay | Interactions and cover per block |
| 032 | Cover is decorative only | Combat route proof |
| 033 | Extraction sites are hidden | Player-view cue screenshots |
| 034 | Streaming budget ignored | Runtime performance report |
| 035 | Terrain proof misses public state | Run local and public views |
| 036 | Catalog mixes approved/candidate | Keep source status explicit |
| 037 | Review packets mistaken as approval | Promotion validator blocks runtime |
| 038 | Converted GLBs have bad scale | Import scale validator |
| 039 | Toon shader fights lighting | Material sample screenshots |
| 040 | Prop library over-fragments | Batch rendering contract |
| 041 | Clutter hides objectives | Proximity readability proof |
| 042 | Train asset does not match path | Boarding sequence proof |
| 043 | Audio promotion uses wrong cue | Cue mapping validator |
| 044 | Music loops fight game state | Cue-state transition proof |
| 045 | Budgets written after imports | Budget before promotion |
| 046 | Rig lacks gameplay sockets | Attach-point validator |
| 047 | Player mesh clips camera | Third-person screenshot states |
| 048 | Animation graph omits failure | Include cancel/hit/drop states |
| 049 | Locomotion slides on slopes | Movement video proof |
| 050 | Camera authority conflicts return | Single-authority validator |
| 051 | Combat camera hides cover/threats | Combat screenshot matrix |
| 052 | Input feels correct only in one view | Look-left/right movement proof |
| 053 | Controller scope expands too early | Keep accessibility contract minimal first |
| 054 | Lobby preview becomes decorative only | Party/identity proof |
| 055 | Bots hide real combat gaps | Mark bot-only proof separately |
| 056 | Hold system feels laggy | Progress timing proof |
| 057 | Mine objects do not read as gold | Resource-form screenshots |
| 058 | Economy becomes spreadsheet-only | Risk/reward playtest |
| 059 | Cargo visual clips or disappears | Carry-state screenshots |
| 060 | Cashout lacks tension | Contest/interrupt proof |
| 061 | Interruption feels unfair | Clear cancel feedback |
| 062 | Ownership breaks in squads | Receipt ownership tests |
| 063 | Inventory bloats first screen | Hide advanced inventory |
| 064 | Tools become stat icons | Tool protokit visuals |
| 065 | Train sequence regresses | Natural boarding proof |
| 066 | Tutorial becomes text-heavy | Teach through actions |
| 067 | Receipts duplicate | Idempotency validator |
| 068 | Results leak internal IDs | Visible-copy validation |
| 069 | Progression distracts from loop | Keep meta optional |
| 070 | Failure recovery teleports oddly | Recovery receipts and screenshots |
| 071 | Combat lacks readable hits | Hit feedback proof |
| 072 | Weapon roles overlap | Role matrix |
| 073 | Downed state stalls solo staging | Bot/self-revive policy |
| 074 | Cover does not block line of sight | Physics/query proof |
| 075 | AI gets stuck on terrain | Pathing scenario proof |
| 076 | Ambushes feel random | Telegraph and trigger receipts |
| 077 | Zone pressure conflicts extraction | Finale state matrix |
| 078 | 60-player proof is fake | Snapshot and simulator scale proof |
| 079 | Party leader edge cases fail | Disconnect/leader-transfer tests |
| 080 | Snapshots get too large | Byte budget report |
| 081 | Reconciliation causes pulsing | Motion video proof |
| 082 | Rejoin creates duplicate cargo | Rejoin receipt gate |
| 083 | Sanity gates reject valid edge cases | Replay suspicious sessions |
| 084 | Bot fill masks performance | Bot count stress test |
| 085 | Matchmaker scope grows into service | Keep private-room static first |
| 086 | Staging UI leaks into player UX | Foldout/proof-only controls |
| 087 | Scenario runner duplicates Playwright | Assign scenario levels |
| 088 | Simulator paths leak | Sanitizer validator |
| 089 | Screenshots miss motion bugs | Use video only for motion |
| 090 | Performance budgets lack thresholds | Fail builds on hard limits later |
| 091 | Network budget misses audio/assets | Include all payload classes |
| 092 | Preview deploy green but public stale | Verify Pages URL after deploy |
| 093 | Replay artifacts too large | Compact receipt snapshots |
| 094 | Telemetry leaks local data | Sanitize reports |
| 095 | QA gate too slow | Split fast/full gates |
| 096 | Polish changes break kits | Re-run domain validators |
| 097 | Accessibility added after UI lock | Add constraints before final UI |
| 098 | Feedback gets lost in chat | Packetize each coherent feedback item |
| 099 | Public docs oversell state | Tie claims to proof |
| 100 | Continuous audit becomes noise | Mark resolved/replaced aggressively |

## Continuous Audit Loop

Every future implementation pass should end with:

1. Update the owning `.agent` packet.
2. Mark resolved/open/fake in a data matrix.
3. Run the closest validator.
4. Capture player-view proof when visual/gameplay-facing.
5. Add one change-log entry.
6. Re-read previous relevant packets before the next feature.
