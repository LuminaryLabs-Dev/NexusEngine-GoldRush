# Local Public Human View Proof Human View Proof

Status: active docs-only

Atom ID: 017-05
Requirement: 017 - Local Public Human View Proof
Domain: validation/human-view
Owner: n:runtime:validation plus proof tools

## Atomic Evidence Objective

Define what a real player must see, hear, do, or understand before this requirement can be considered player-facing complete.

## Data Contract Seed

scenario id, viewport, player action, expected visible result, audio cue, video need

## Event And Snapshot Seed

Event: humanViewProofDefined

Snapshot must include requirement id, atom id, owner, evidence status, evidence freshness, unresolved caveats, and sanitized artifact labels.

## Evidence Required

Playwright or retained media can prove the player-facing claim.

## Research Pair

- research/017-05-local-public-human-view-proof-human-view-proof-research.md

## Stop Condition

Stop if the evidence is stale, local-only for a public claim, too narrow for the requirement, based on intent instead of proof, or dependent on runtime work that is not allowed under the current docs-only boundary.
