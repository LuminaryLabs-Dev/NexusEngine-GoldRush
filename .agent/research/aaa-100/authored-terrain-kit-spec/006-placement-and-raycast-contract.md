# Placement And Raycast Contract

Status: active docs-only

## Purpose

Make every prop, resource, town, extraction, cover, and train support attach to authored terrain through explicit masks and downward raycast placement.

## Placement Pipeline

~~~txt
candidate region
-> mask filters
-> slope and normal filters
-> route and sightline filters
-> downward raycast
-> anchor receipt
-> prop/gameplay descriptor
-> renderer/physics/gameplay consumers
~~~

## Required Receipt

~~~txt
placementId
sourceRevision
anchorType
x
z
sampledY
normal
slope
maskHits
consumerKit
validity
failureReason
~~~

## Consumer Rules

- Prop protokits can request anchors but cannot invent terrain height.
- Mining objects must use gold density and walkability masks.
- Extraction sites must use extraction, route, sightline, and walkability masks.
- Towns and camps must use flatness plus route relationship checks.
- Rails must use spline supports and sampled terrain, not free-floating strips.
- Cover must use physical blocker or future cover-collider evidence.

## Risk

The most likely regression is a visually acceptable object that is impossible to reach, impossible to interact with, or not actually on the collision surface.
