# 026 Collider parity - Validation

Status: active
Domain: physics

## Validation Plan
- Add or identify one CLI validator for the data contract.
- Add or identify one snapshot check for downstream kit consumption.
- Require Playwright screenshot proof if the result changes what the player sees.
- Require video proof if the result changes camera, movement, train, animation, or timing.
- Require public Pages proof before describing the feature as deployed.

## Current Closest Validators
- node tools/validation/validate-report-secrets.mjs
- node tools/validation/validate-domain-kit-contracts.mjs
- node tools/validation/validate-terrain-collider.mjs
- node tools/validation/validate-procedural-renderer-kits.mjs

## Pass Condition
The proof must state exactly what it covers and must not be used to claim full AAA or 60-player readiness unless it actually exercises that scope.
