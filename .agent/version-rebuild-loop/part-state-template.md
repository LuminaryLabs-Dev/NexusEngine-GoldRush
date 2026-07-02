# Part State Template

Status: template

## Part

- Version:
- Version decision: `continue | increment`
- Domain:
- Generic kit:
- GoldRush kit:
- Source data:
- Player-facing action:

## Current State

- State: `validated | partial | fake | broken | missing | stale`
- Evidence:
- Validator:
- Browser proof:
- Public proof:
- Known limits:

## Rebuild Decision

- Promote decision: `promote | promote with limits | hold | reject`
- Reason:
- Lesson:
- Next version input:

## Fakeout Audit

- Can this pass through helper-only state?
- Can this pass through renderer-only state?
- Can this pass with stale source data?
- Can this pass locally while public proof is stale?
- Can this be mistaken for live multiplayer readiness?
- Does this require inheriting an entire old subsystem to keep working?
- Is this carrying a bad assumption into the next version?
