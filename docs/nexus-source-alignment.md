# Nexus Source Alignment

## Purpose

Gold Rush must stay anchored to the installed NexusRealtime and NexusRealtime ProtoKits source docs while it incubates local generic kits and game-specific GoldRush kits.

## Source Anchors

```txt
node_modules/nexusrealtime/README.md
node_modules/@luminarylabs/nexusrealtime-protokits/README.md
node_modules/@luminarylabs/nexusrealtime-protokits/docs/START-HERE.md
node_modules/@luminarylabs/nexusrealtime-protokits/docs/domain-protokit-contract.md
node_modules/@luminarylabs/nexusrealtime-protokits/docs/DSM-START-HERE.md
```

The executable manifest is:

```txt
manifests/source-docs/nexus-kit-source-alignment.json
```

## Local Interpretation

- NexusRealtime is the runtime substrate: install kits, tick, inspect state, validate behavior, then promote stable systems.
- ProtoKits are reusable DSM/DSK sources: domain-first, renderer-agnostic, data-contract driven, headless validated.
- GoldRush is not the reusable architecture source. It composes generic incubator kits and owns game-specific rules through custom kits.
- Renderer and browser code stay in adapter roots; non-adapter kits expose descriptors, snapshots, receipts, and events.
- The ME ledger at `/Users/crimsonwheeler/Documents/Me/GoldRush/.agent/goal.md` is a local tracking projection, not a replacement for repo validators. CI uses tracked `goal.md` as the fallback projection because the local ME folder is not present on GitHub runners.

## Validation

```txt
node tools/validation/validate-nexus-source-alignment.mjs
```

The validator checks source doc anchors and hashes, package-lock commits, local kit contract mappings, non-adapter renderer boundaries, headless runtime install proof, ProtoKit construction against NexusRealtime, and goal ledger markers.
