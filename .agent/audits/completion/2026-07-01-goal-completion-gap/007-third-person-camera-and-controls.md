# Third Person Camera And Controls

Status: active docs-only

Requirement ID: 007
Domain: control/camera
Owner: n:control:third-person-camera plus n:goldrush:exploration-camera
Current status: partial

## Current Evidence

Goal and lessons require camera-relative WASD, mouse look, and one camera authority. Current proof direction says camera stability exists for current slices.

## Why This Is Not Complete Yet

Final proof must cover exploration, combat, loading-yard, train boarding, extraction, and results transitions without camera conflict or pulsing.

## Evidence Required To Close

- camera authority validator across all scene transitions
- movement video for mouse-look and WASD on authored terrain
- combat camera shift proof without changing character rig position incorrectly

## Completion Rule

Do not mark this requirement complete from intent, a narrow validator, or a stale proof report. It needs current authoritative evidence matching the full requirement scope.

## Implementation Boundary

This is an audit packet only. It does not authorize runtime changes under the current docs-only boundary.
