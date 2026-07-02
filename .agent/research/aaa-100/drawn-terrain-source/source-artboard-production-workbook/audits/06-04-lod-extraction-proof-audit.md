# Lod Extraction Proof Hardening Audit

Status: active docs-only
Atom: 06-04

## Audit Question

How could lod-extraction / proof look complete while the map still feels procedural, flat, or unplayable?

## Fake Completion Risks

- The file exists but no kit consumes it.
- A validator checks counts but not source parity.
- A screenshot looks denser but routes remain unclear.
- A public report passes but does not name the source revision.
- The atom improves a fixture but leaves the full map path ambiguous.

## Hardening Requirement

Require one data check, one consumer check, one player-view check when visual, and one restart check before this atom moves toward resolved.

## Evidence To Capture Later

- Source revision id.
- Source field or annotation sample.
- Kit snapshot evidence.
- Validator or simulator evidence.
- Local/public proof evidence when player-facing.
