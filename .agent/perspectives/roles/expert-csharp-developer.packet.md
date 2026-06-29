# Expert C# Developer Packet

## Simulation Summary

An expert C# developer will care about faithfully translating Unity script intent into deterministic browser runtime contracts without copying Unity runtime dependencies.

## Expected Outcome

- C# behaviors become testable JavaScript domain service APIs.
- Networked Unity/Fusion state is replaced by NexusRealtime state.
- Serialized fields become explicit descriptor values.
- Unity methods like `AddGold`, spawn zones, camera combat flags, and animation params have clear equivalents.

## Failure Signs

- C# behavior is copied as loose procedural JS in the renderer.
- Network authority rules are skipped.
- Idempotency is missing for mining, deposits, damage, or cue playback.
- Serialized values from Unity evidence disappear from the implementation.

## Evidence Needed

- Validators for duplicate deposits, mining yields, room boundaries, and state transitions.
- Domain APIs for gold zones, audio state, animation state, scene transitions, and camera state.
- Docs explaining which Unity classes informed each kit.

## Recommended Next Action

Create dedicated kits for `goldrushGoldZones`, `goldrushAudio`, and `goldrushAnimation` so Unity script concepts are no longer buried in aggregate world data.
