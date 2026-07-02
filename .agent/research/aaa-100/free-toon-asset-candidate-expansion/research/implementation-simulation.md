# Implementation Simulation

Status: active docs-only

## Purpose

Simulate the next asset implementation pass before coding or importing.

## Simulated Path

```txt
choose one candidate set
-> capture source and license evidence
-> add candidate manifest record
-> store review-only files
-> create protokit descriptor
-> adapt toon material roles
-> place through terrain/raycast consumer
-> run validator
-> capture local screenshot
-> capture public screenshot
-> decide whether to promote later
```

## Expected First Failure

The most likely first failure is mismatch between visual asset scale and the current terrain/player scale. Train parts, rocks, and character rigs may all be individually valid but unreadable together if pivot, unit scale, and camera distance are not normalized.

## Expected Second Failure

The renderer may be tempted to own placement because it can quickly place the asset. That would break the domain design. Placement must come from terrain source, raycast query, and object protokit descriptors.

## Expected Third Failure

Audio may sound better but weaken state clarity if one cue is reused for title, train, mining, and cashout. Every candidate audio file must map to one semantic cue family first.

## Player-View Risk

The player may see nicer assets but still not understand where to go, what to mine, what is cover, what is cashout, or whether the train can be boarded. Better art without interaction meaning is still a plateau.

## Stop Condition

Stop the pass if the candidate cannot pass source evidence, style adaptation, target kit ownership, placement/cue ownership, and local screenshot proof.

