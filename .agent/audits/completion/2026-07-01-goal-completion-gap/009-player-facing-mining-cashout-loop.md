# Player Facing Mining Cashout Loop

Status: active docs-only

Requirement ID: 009
Domain: gameplay/UX
Owner: n:gameplay:interaction-hold plus n:goldrush:player-action-surface
Current status: partial

## Current Evidence

Goal packet 02 says player-loop readiness tracks resource cue, mine hold, cargo visual, cashout cue, cashout hold, and receipt-backed results.

## Why This Is Not Complete Yet

The loop has structural proof, but final completion requires tactile fidelity, animation/audio/object feedback, cancel feedback, and no hidden completion helpers.

## Evidence Required To Close

- human-view proof mines from an object protokit
- carry and cashout require natural movement and hold interaction
- results derive from receipts with no direct helper completion

## Completion Rule

Do not mark this requirement complete from intent, a narrow validator, or a stale proof report. It needs current authoritative evidence matching the full requirement scope.

## Implementation Boundary

This is an audit packet only. It does not authorize runtime changes under the current docs-only boundary.
