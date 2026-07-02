# Feedback Layer Contract

Status: active docs-only

## Purpose

Define the feedback stack every player-facing GoldRush action should expose.

## Stack

```txt
state change
|-- public event
|-- snapshot field
|-- body or object motion
|-- audio cue
|-- VFX or material cue
|-- diegetic prompt or world cue
|-- receipt
|-- proof assertion
```

## Minimum Per Action

- Movement: input, velocity, body direction, foot/body response, terrain state.
- Mining: target, range, progress, tool/body response, material/audio cue, reward receipt.
- Cargo: visible load, speed/posture/noise change, drop/deposit event.
- Threat: warning cue, direction/distance, cover option, combat receipt.
- Cashout: landmark, range, progress, contest risk, completion receipt.
- Results: score, extracted value, replay moments, restart action.

## Hard Rule

Renderer code may draw feedback, but domain kits own the meaning, priority, action state, and proof data.
