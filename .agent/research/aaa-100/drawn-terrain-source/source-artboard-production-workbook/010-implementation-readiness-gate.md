# Implementation Readiness Gate

Status: active docs-only

## Purpose

Define when future code work may start from this workbook.

## Minimum Fixture

Before runtime implementation, create a tiny artboard fixture plan that includes:

- source revision id
- bounds and scale
- height samples
- normal or derivable normal
- slope classes
- material mask
- walkable/blocker masks
- route annotations
- one mine annotation
- one gold annotation
- one cashout annotation
- one cover annotation
- one asset stamp family
- one LOD cell overlay
- proof shot anchors

## Required Implementation Order Later

```txt
source fixture
|-- source validator
|-- query API
|-- render one chunk
|-- collider sample parity
|-- placement raycast
|-- gameplay annotation read
|-- human-view shot
`-- public proof revision check
```

## Stop Conditions

- any consumer cannot report source revision id
- renderer and collider use different samples
- object placement ignores source anchors
- gameplay route ignores source annotations
- screenshot improves density but not readability
- proof passes locally but not publicly
