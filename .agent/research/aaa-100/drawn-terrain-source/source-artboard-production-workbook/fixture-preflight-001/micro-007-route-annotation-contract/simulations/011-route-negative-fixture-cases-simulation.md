# 011 - Route Negative Fixture Cases Simulation

Status: planned docs-only
Parent atom: `007-route-annotation-contract`

## Implementation Simulation

1. Future code adds or loads `routeNegativeCases` from the fixture.
2. The first validator checks that the field exists and is serializable.
3. Player guidance or AI staging consumes the query output and echoes fixture id, revision id, route id, segment id, lane class, and source tags.
4. A negative fixture tries to pass by using a visible route ribbon or coordinate-only target.
5. The validator rejects the negative fixture and marks dependent proof stale.

## Expected Failure

The first likely failure is a permissive default where any visible trail or direct target counts as a route, even when the source annotation is missing, disconnected, or stale.

## Recovery Path

- Add a closed source field for `routeNegativeCases`.
- Add consumer echo in player guidance and AI staging snapshots.
- Add a negative case that would have passed before route annotations existed.
- Add stale-proof metadata when the fixture revision changes.

## Player View Implication

A player should understand the route web as a readable prospecting path: main trail, branch, return lane, risky detour, objective approach, and recovery path all need authored meaning.
