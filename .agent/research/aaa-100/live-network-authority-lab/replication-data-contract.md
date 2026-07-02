# Replication Data Contract

Status: active

## Replication Categories

| Category | Reliability | Priority | Notes |
| --- | --- | --- | --- |
| receipts | ordered | critical | irreversible facts |
| local input | ordered per peer | high | commands with sequence ids |
| nearby actors | latest-wins | high | position, facing, animation state |
| distant actors | latest-wins | medium | reduced update rate |
| world phase | ordered | high | final rush, scene site, match phase |
| cosmetic cues | latest-wins | low | dust, transient visual hints |

## Required Snapshot Fields

- snapshot id.
- base snapshot id.
- tick.
- mode id.
- partition id.
- entity count.
- byte size.
- receipt high-water mark.
- schema version.
