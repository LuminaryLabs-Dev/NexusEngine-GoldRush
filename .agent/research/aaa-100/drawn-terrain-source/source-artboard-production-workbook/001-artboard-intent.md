# Artboard Intent

Status: active docs-only

## Intent

GoldRush needs a massive frontier claim region that feels authored from the first over-the-shoulder view: the player should understand that they are in a wild-west gold field with a train route, mine routes, town shelves, cashout landmarks, cover, danger, and a final-rush pressure space.

## Source Authority Rule

The source artboard is the map authority. Procedural systems may derive, decorate, simplify, or validate it, but they may not replace it with local rules.

## Player Promise

The map should say this without UI:

- the train brought me here
- the mine and gold seams are worth moving toward
- the central mountain changes routes
- the town, rail, and cashout are recognizable landmarks
- shortcuts are risky but valuable
- cover and high ground matter
- the final rush will compress the claim region

## Kit Promise

Every kit consuming terrain should be able to name the same `sourceRevisionId`:

- renderer chunks
- collider samples
- raycast placement
- object protokits
- route guidance
- combat cover
- extraction sites
- bot staging
- public proof
