# Gold Rush Perspective Packets

## Purpose

These packets are internal simulations of how different people would view `NexusEngine-GoldRush` before the next implementation pass.

They are not camera perspectives. They are decision lenses for agents: player-visible, systems, asset import, legacy fidelity, multiplayer, and release readiness.

## How To Use

Before changing direction, read the packet that matches the work:

```txt
roles/creative-director.packet.md
roles/expert-csharp-developer.packet.md
roles/unity-port-developer.packet.md
roles/technical-art-director.packet.md
roles/nexus-runtime-architect.packet.md
roles/marketing-lead.packet.md
audiences/player-segments.packet.md
audiences/creator-influencer.packet.md
market/market-research.packet.md
market/market-itself.packet.md
market/storefront-positioning.packet.md
player-view.packet.md
legacy-unity-port.packet.md
nexus-runtime.packet.md
asset-import.packet.md
multiplayer-room.packet.md
release-review.packet.md
```

Each packet should answer:

- what this person expects to see.
- what would make them think the build is failing.
- what evidence would convince them the next pass worked.
- what the next local GoldRush-only action should be.

## Standing Constraints

- Only edit `NexusEngine-GoldRush` locally.
- Do not clone old Unity repos or kit repos locally.
- Ask GPT-it/cloud-side workers to inspect or move external source data.
- Raw Unity assets must not enter runtime.
- Runtime state should be owned by NexusRealtime domain kits, not renderer-only logic.

## Perspective Scale

Do not try to hand-write hundreds of packets. Use the packet matrix:

```txt
role x concern x proof type
```

Examples:

- creative director x identity x screenshot proof.
- Unity developer x port fidelity x YAML/script evidence.
- C# developer x behavior parity x deterministic validators.
- market segment x appeal x positioning proof.
- player type x first-session clarity x browser interaction proof.
