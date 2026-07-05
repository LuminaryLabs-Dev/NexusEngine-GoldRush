# Version Matrix

Status: active docs-only

## Purpose

Track full-version rebuild attempts from the current prototype toward a working non-test game.

Versions are allocated only when the newest version is no longer the best base. Future version numbers are not a fixed schedule.

## Matrix

| Version | Role | Source base | Decision state | Required proof before next turn |
| --- | --- | --- | --- | --- |
| `v0.0.1` | Prototype baseline and reference | current repo state | update-ready reference | `v0.0.1-update-ready.md` proves exactly what can and cannot be inherited |
| `v0.0.2` | Active kit-by-kit rebuild layer | `v0.0.1` validated contracts and lessons only | architecture scaffold | `v0.0.2-audit.md` must prove registry, domains, proof groups, validators, and app state surface |
| `v0.0.3+` | Future ground-up rebuild attempt | created only when newest version is stuck/structurally wrong | allocate only when needed | new version packet proving inherited validated parts and rejected stale/fake parts |

## Version Allocation Rule

- Start at `v0.0.1`.
- Increment one patch version only when the newest version is no longer the best base.
- A new version is a ground-up rebuild attempt.
- A version can take many turns.
- A turn does not need a new version unless the newest one is stuck, fake, stale, overcomplicated, or structurally wrong.
- Continue for as many versions as needed.

## Promotion Rule

A version can carry a part forward only when proof names:

- domain
- kit
- source data or event
- validator or proof command
- local result
- public result when relevant
- known limits
- lesson applied to the next version

If a part lacks this evidence, mark it partial, fake, broken, missing, or stale instead of carrying it forward.
