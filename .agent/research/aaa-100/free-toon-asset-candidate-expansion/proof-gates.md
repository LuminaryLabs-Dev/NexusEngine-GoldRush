# Candidate Asset Proof Gates

Status: active docs-only

## Purpose

Define the proof chain required before a free model or audio candidate can affect player-facing GoldRush gameplay.

## Gate Chain

```txt
source page proof
-> license proof
-> candidate manifest
-> file integrity proof
-> style adaptation proof
-> kit descriptor proof
-> placement or cue proof
-> local browser proof
-> public browser proof
-> restart packet
```

## Visual Candidate Proof

| Proof | Required evidence |
| --- | --- |
| Candidate record | source URL, license URL, author, file names, intended family |
| Style adaptation | palette, material role, scale, pivot, shadow/readability note |
| Kit descriptor | `domainPath`, public snapshot, placement role, interaction role |
| Terrain placement | downward raycast hit, slope range, avoid masks, height match |
| Human view | title/lobby/run screenshot depending on site |
| Public proof | same visible object family on deployed build |

## Audio Candidate Proof

| Proof | Required evidence |
| --- | --- |
| Candidate record | source URL, license URL, author, cue target |
| Cue-state mapping | title, lobby, train, mine, carry, cashout, combat, result |
| Loudness plan | normalized level, loop/one-shot, distance or UI role |
| Fallback parity | procedural fallback still exists until approval |
| Human hearing proof | captured cue event plus player-facing state transition |
| Public proof | deployed cue-state report without local-only paths |

## Stop Condition

If any proof gate is missing, the asset remains a candidate and must not be described as imported runtime content.

