# Digital Asset Layering Gate

Status: active docs-only
Domain: content / render / world

## Purpose

Prevent digital assets from becoming another pile of primitives or imports disconnected from the terrain source.

## Layer Model

```txt
terrain source revision
|-- material masks
|-- route and zone masks
|-- placement anchors
`-- asset families
    |-- ridge and cliff forms
    |-- rock and talus forms
    |-- cactus and scrub forms
    |-- mine entrance forms
    |-- gold seam forms
    |-- rail and depot forms
    |-- town and camp forms
    |-- cover forms
    `-- signage and route cues
```

## Asset Family Gate

Each digital asset family needs:

- candidate source or generated source record
- license/provenance decision
- protokit id
- placement mask
- anchor rules
- scale range
- collision role
- interaction role
- render batch role
- human-view proof state

## Rule

Assets can be procedural, imported, or drawn, but their runtime placement must come from source-derived anchors or masks.

## Failure Modes

- high-quality rocks placed on impossible slopes
- mine entrance floats or clips into ridge mesh
- town assets do not align with roads, rails, or walkable land
- cover assets create unreadable combat lanes
- gold seams are visible but not mineable
- extraction landmark is visible but not reachable

## First Useful Asset Slice

Do not start with every asset family. Start with one tiny authored terrain slice that includes:

- one ridge wall
- one walkable wash
- one mine entrance
- one gold seam
- one route marker
- one extraction landmark

That slice is enough to prove the source-first pipeline before bulk asset work.

