# Camera/Ground Stability Readability - 2026-07-01

## Domain

`n:control:third-person-camera`, `n:control:character-movement`, `n:world:terrain-raycast`, `n:physics:query`, and `n:render:three-scene`.

## Source Scan

- Microsoft Xbox Accessibility Guideline 107 frames input access as more than remapping. It calls out analog mouse/stick control, digital alternatives, speed, duration, sensitivity, and input complexity as barriers. Relevance: GoldRush must keep `camera-relative-wasd` and `mouse-look` deterministic and testable, while later adding sensitivity and digital-look options.
- Game Accessibility Guidelines on controller/camera movement warns that mismatches between player control and camera movement, including head bob, weapon bob, motion blur, camera shake, tilt, smoothing, or forced view changes, can block play. Relevance: GoldRush camera pulsing must be treated as a player-facing failure, not a harmless rendering artifact.
- Game Accessibility Guidelines on flicker and repeated patterns warns against oscillating/reversing visual patterns and repeated high-contrast movement. Relevance: terrain/camera pulsing, repeated seam flicker, and frame-to-frame surface swaps need long-run proof rather than single screenshots.

Sources:

- https://learn.microsoft.com/en-us/xbox/accessibility/xbox-accessibility-guidelines/107
- https://gameaccessibilityguidelines.com/avoid-or-provide-option-to-disable-any-difference-between-controller-movement-and-camera-movement/
- https://gameaccessibilityguidelines.com/avoid-flickering-images-and-repetitive-patterns/

## AAA Gap

Current proof already shows:

- `camera-relative-wasd` exists.
- mouse-look updates player yaw.
- terrain raycast grounding exists.
- `cannon-es` heightfield exists.
- same-phase camera perspective selection is latched in runtime validation.

Current proof did not sufficiently show:

- camera position stability over a long enough gameplay window.
- player y and movement-owned ground staying aligned for many frames.
- render-ground and movement-ground staying aligned for many frames.
- active mouse-look plus WASD can run without camera reselecting.
- terrain sampling does not visibly pulse every other frame.

## Kit Requirement

The proof surface should be owned as a kit-facing harness:

```txt
camera-ground-stability-proof
├─ domain: n:control:third-person-camera
├─ consumes: n:control:character-movement
├─ consumes: n:world:terrain-raycast
├─ consumes: n:physics:query
├─ observes: renderer camera snapshot
└─ rejects: camera reselection, ground mismatch, render-ground mismatch, large camera jumps, large ground deltas
```

## Implementation Decision

Add a Playwright proof harness instead of changing camera code first.

Reason:

- The current public/local path is passing.
- The player-facing risk is subtle frame-to-frame motion.
- A long-run proof makes later camera, terrain, and renderer edits safer.

## Acceptance

The proof must:

- enter the match by natural train boarding.
- sample at least 120 run frames.
- verify screen stays `run`.
- verify active site stays `site.gold-field`.
- verify selected camera perspective does not change mid-phase.
- verify motion authority stays `transition-latched-player-follow`.
- verify player y matches movement ground.
- verify render ground matches movement ground.
- verify mouse-look yaw changes when look delta is applied.
- verify WASD moves the player.
- reject large one-frame camera jumps.
- reject large one-frame ground deltas.

## Next Follow-Up

After this proof is stable, the next gameplay-facing pass should use it while improving:

- resource object visual hierarchy.
- combat pressure as a playable encounter.
- full mine -> carry -> walk -> hold extract -> results proof without direct completion helper.
