# Control Consumer Contract

Status: active docs-only

Packet: 015
Domain: control
Target kit: n:control:third-person-camera plus n:control:character-movement
Roadmap atoms: 023, 026

## Purpose

Define how movement and over-shoulder camera consume ground queries without competing with terrain, transition, or test camera systems.

## Why This Prevents Plateau

Player experience plateaus when camera and character motion fight each other while the terrain under them is uncertain.

## Data Exposed

- cameraYaw
- cameraPitch
- moveVector
- groundHit
- slopeState
- capsuleState
- cameraAuthorityId

## Public API Shape

- applyCameraLook(delta)
- moveRelativeToCamera(input)
- getControlSnapshot()
- resetControlAuthority(reason)

## Events And Snapshot

- cameraLookApplied
- characterGrounded
- movementBlockedBySlope
- cameraAuthorityReset

Snapshot must include the target kit, source revision, consumer revision, validation state, and enough domain state to debug without leaking machine-local paths.

## Validation And Proof

- Playwright route proof uses mouse-look and WASD relative to camera direction
- CLI checks only one camera authority owns gameplay camera per frame

## Edge Cases And Stop Conditions

- Do not reselect camera poses every frame.
- Do not let transition cameras keep authority after gameplay starts.
- Stop if movement uses world axes instead of camera-relative axes.

## Implementation Note

Do not code from this packet alone. Read the parent authored terrain spec, the matching atomic map packet, the matching four research packets, the implementation simulation, and the hardening audit before editing runtime files.
