# Extraction Stakes Results Public Deploy Proof

Status: active docs-only

Atom ID: 011-06
Requirement: 011 - Extraction Stakes Results
Domain: match/gameplay/results
Owner: n:gameplay:extraction plus n:match:receipts plus n:match:results

## Atomic Evidence Objective

Define how the final public Build/Page proof must demonstrate this requirement without relying only on local state.

## Data Contract Seed

build commit, public url, scenario, report id, screenshot id, caveat label

## Event And Snapshot Seed

Event: publicDeployProofDefined

Snapshot must include requirement id, atom id, owner, evidence status, evidence freshness, unresolved caveats, and sanitized artifact labels.

## Evidence Required

Public proof covers the requirement scope and links to the final build evidence.

## Research Pair

- research/011-06-extraction-stakes-results-public-deploy-proof-research.md

## Stop Condition

Stop if the evidence is stale, local-only for a public claim, too narrow for the requirement, based on intent instead of proof, or dependent on runtime work that is not allowed under the current docs-only boundary.
