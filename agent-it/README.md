# Agent-It Index

Status: active

## Purpose

This folder is the visible agent-it index for the GoldRush build. The canonical working packets stay in `.agent/` so existing validators, feedback packets, goal packets, research packets, and change logs keep one source of truth.

## Operating Map

```txt
agent-it/
└─ README.md

.agent/
├─ start-here.md
├─ workflow.md
├─ intention.md
├─ goal.md
├─ memory.md
├─ change-log.md
├─ goal-packets/
├─ feedback-packets/
├─ research/
├─ audits/
└─ resolved/
```

## Current Rule

Every substantial pass should:

1. Read `.agent/start-here.md`, `.agent/goal.md`, and the relevant goal or feedback packet.
2. Identify the owning NexusRealtime-style domain and kit before changing code.
3. Add or update a validator/proof for the changed domain.
4. Update `.agent/change-log.md`.
5. Update `.agent/memory.md` only for durable architecture or product decisions.
6. Keep web-backed AAA gap research in `.agent/research/`.

## Current Focus

GoldRush should keep moving toward a player-driven extraction loop:

```txt
title -> lobby -> loading train -> spawn -> move -> mine -> carry -> cashout -> score -> results
```

The current proof slice is `n:goldrush:player-driven-extraction-route`.
