# Feel Axis Matrix

Status: active docs-only

## Purpose

Map each player-feel axis to a domain, owning generic-style kit, GoldRush custom kit, and primary proof target.

| Axis | Domain | Generic kit | GoldRush kit | Primary proof |
| 01 Camera Mouse Look Feel | control/camera | n:control:third-person-camera | n:goldrush:exploration-camera | Record 10 seconds of slow mouse pan, fast turn, stop, walk-forward turn, and wall/mountain proximity. |
| 02 Camera Authority Stability | runtime/control | n:runtime:authority-lock | n:goldrush:camera-authority | Compare video frame deltas during title, lobby, loading-yard, train lock, gold-field, combat, and results transitions. |
| 03 WASD Locomotion Feel | control/movement | n:control:character-movement | n:goldrush:prospector-movement | Record figure-eight walking, forward camera turn, diagonal strafe, stop, slope climb, and blocked mountain attempt. |
| 04 Terrain Footing Grounding Feel | world/physics/control | n:world:terrain-raycast | n:goldrush:player-grounding | Walk across flat ground, ridge foot, wash, ramp, seam, gold zone, cashout zone, and mountain blocker edge. |
| 05 Character Rig Body Readability | character/render | n:animation:rig-readability | n:goldrush:prospector-rig | Capture front, back, three-quarter, lobby spin, walk, mine, carry, and extraction hold poses. |
| 06 Locomotion Animation Blend | animation/control | n:animation:state | n:goldrush:prospector-animation | Video walk/stop/start/strafe/carry/mine/cashout and compare character velocity to visible foot/body motion. |
| 07 Mining Hold Tactility | gameplay/interaction/audio/vfx | n:gameplay:interaction-hold | n:goldrush:mine-hold-action | Capture approach, prompt, hold start, mid-hold, cancel, complete, cargo gain, and nearby threat pressure. |
| 08 Cargo Weight Feedback | gameplay/character/audio | n:gameplay:cargo | n:goldrush:gold-carrying | Record unloaded movement, loaded movement, heavy movement, threat response, drop, pickup, and deposit. |
| 09 Resource Object Readability | content/render/gameplay | n:render:micro-object-instancing | n:goldrush:resource-object-protokits | Capture near/mid/far gold seam, ore lode, nugget cluster, depleted state, and clutter compression. |
| 10 Cashout Tension Feedback | gameplay/extraction/audio/vfx | n:gameplay:extraction | n:goldrush:cashout-sites | Capture cashout landmark from distance, approach cue, in-range prompt, hold progress, contest, interruption, completion, results. |
| 11 Threat Telegraph Readability | combat/audio/vfx/world | n:gameplay:combat-pressure | n:goldrush:ambush-pressure | Record cargo noise, first warning, line-of-sight cue, cover cue, near miss, damage, and recovery. |
| 12 Cover And Combat Counterplay | combat/world/physics | n:physics:query | n:goldrush:cover-counterplay | Capture threat approach, selected cover, walk-to-cover, protected state, peek, hit/miss result, and route continuation. |
| 13 Weapon Hit Feedback | combat/audio/vfx/receipts | n:combat:hit-feedback | n:goldrush:western-weapon-feedback | Record aim, fire, miss, hit, damage cue, target reaction, reload/cooldown, and receipt/results summary. |
| 14 Audio Cue Layering | audio/runtime | n:audio:cue-state | n:goldrush:music-and-stingers | Capture title, lobby, train arrival, door, board, depart, mine, cargo, threat, cashout, result, and mute/restart behavior. |
| 15 VFX And Diegetic Cues | render/gameplay/audio | n:render:diegetic-cues | n:goldrush:player-guidance-cue | Capture route arrow, mine cue, hold cue, cargo cue, threat cue, cover cue, cashout cue, result cue, and no-cue idle state. |
| 16 Results Payoff Readability | match/presentation/audio | n:match:results | n:goldrush:results-screen | Capture low-gold, high-gold, contested, failed extraction, combat-heavy, and clean-route result variants. |
| 17 Accessibility And Control Comfort | control/ux/accessibility | n:control:input-comfort | n:goldrush:control-comfort | Capture low/high sensitivity, hold-to-toggle, reduced motion, cue contrast, captions, mute groups, and restart persistence. |
| 18 Local Public Human View Proof | validation/release | n:runtime:validation | n:goldrush:human-view-proof | Capture title, lobby, train, walking, mining, cargo, threat, cashout, results locally and publicly after each player-facing pass. |
