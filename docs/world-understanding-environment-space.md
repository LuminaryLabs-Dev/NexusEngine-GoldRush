# World Understanding Environment Space

## Purpose

Gold Rush should not try to match a single reference picture. The scene should understand the environment space first, then place terrain, routes, landmarks, and props because they belong in that space.

## Correct Art Direction

Reference images are useful for vocabulary:

- red canyon rock
- mine entrance
- cactus and dry grass
- false-front town buildings
- rail, cart, barrels, crates, tailings, and gold seams

They should not define composition one-to-one. The playable world composition comes from spatial logic.

## Space Model

The current environment-space contract defines:

- `space.canyon-basin`: main playable volume.
- `space.wash-floor-trail`: readable movement and extraction corridor.
- `space.west-ridge-wall`: left geologic container.
- `space.east-ridge-wall`: right geologic container.
- `space.mine-shelf`: mine entrance, rail, tailings, cart, and seam relationship.
- `space.town-shelf`: false-front buildings, street line, cover, and water tower.
- `space.gold-seam`: gold in rock and tailings, not random yellow scatter.
- `space.extraction-sightline`: route readability under pressure.

## Rules

- Terrain form comes before prop placement.
- The wash floor and trail must stay readable.
- Mine props are organized by shelf, wall, rail, and downhill tailings.
- Town props are organized by street, frontage, cover, and skyline.
- Gold belongs to seams, deposits, claim markers, and wash locations.
- Far objects should read as silhouettes, not small clutter.
- The camera catalog should sample spaces to prove playability from many views.

## Validation

`npm run check` validates that:

- world state exposes large-scale environment spaces.
- procedural scene state exposes renderer-space environment understanding.
- every micro-kit has an `environmentSpaceId`.
- the descriptor explicitly rejects reference-image-copy composition.
