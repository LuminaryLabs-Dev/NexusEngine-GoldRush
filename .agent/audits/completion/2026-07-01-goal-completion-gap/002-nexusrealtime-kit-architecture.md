# NexusRealtime Kit Architecture

Status: active docs-only

Requirement ID: 002
Domain: architecture/runtime
Owner: n:runtime:domain-registry plus GoldRush custom kits
Current status: partial

## Current Evidence

README and lessons matrix identify NexusRealtime-style domain kits, generic incubator kits, ProtoKit bridge, and GoldRush custom kits as the architecture.

## Why This Is Not Complete Yet

Architecture is broadly documented and partially validated, but final completion requires every gameplay domain to expose public API, events, snapshots, reset, and validators with no hidden renderer ownership.

## Evidence Required To Close

- domain-kit validator covers every active gameplay kit
- runtime snapshot exposes all active loop domains
- renderer has no hidden gameplay authority

## Completion Rule

Do not mark this requirement complete from intent, a narrow validator, or a stale proof report. It needs current authoritative evidence matching the full requirement scope.

## Implementation Boundary

This is an audit packet only. It does not authorize runtime changes under the current docs-only boundary.
