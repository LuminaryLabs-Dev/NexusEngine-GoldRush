# Public Proof And Restart

Status: active docs-only
Fixture id: `goldrush.desert.artboard.fixture.001`

## Purpose

Define how the first source fixture remains repeatable across local proof, public proof, and future restarts.

## Public Proof Requirements

Future public proof must report:

- fixture id
- revision id
- active scene site
- source validation status
- render consumer revision
- collider consumer revision
- placement consumer revision
- gameplay consumer revision
- proof shot id
- screenshot artifact id

## Restart Policy

Every source revision change must create a restart packet that names:

- what changed in source data
- which consumers need rebuild
- which validators must run again
- which screenshots are stale
- which public proof is stale
- whether player movement, collider, placement, or gameplay annotations changed

## Versioning Rule

Do not silently mutate `goldrush.desert.artboard.fixture.001`. If source fields change in a way that affects consumers, bump the revision id and force caches to rebuild.

## Deployment Risk

Local success is not enough. A public page can still be stale, built from another branch, or missing the new fixture. Future deploy proof must inspect the runtime state and screenshot content, not only the workflow status.

## Stop Condition

Stop if proof cannot distinguish these states:

```txt
local fixture valid
public fixture valid
public build stale
consumer stale
proof screenshot stale
```
