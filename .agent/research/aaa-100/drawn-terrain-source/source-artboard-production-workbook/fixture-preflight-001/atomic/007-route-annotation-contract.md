# 007 - Route Annotation Contract

Status: planned docs-only
Fixture id: `goldrush.desert.artboard.fixture.001`
Domain: world/gameplay
Generic kit candidate: `n:world:route-annotations`
GoldRush kit candidate: `n:goldrush:prospector-routes`

## Purpose

Make one source-fixture concern small enough for a future implementation pass.

## Atomic Scope

- Source data: primary route, alternate route, branch, return lane.
- Public proof: getZoneAt reports route tags at proof points.
- Consumer boundary: the owning kit reports fixture id and revision id in snapshot output.
- Runtime boundary: no renderer, physics, placement, or gameplay fallback may replace this source field silently.

## Substeps

1. Define the source field or snapshot requirement.
2. Add a validator failure case for missing or drifting data.
3. Add one consumer proof path.
4. Add one human-view or state-proof expectation.
5. Mark stale proof if the fixture revision changes.

## Stop Condition

Stop if this atom can pass without proving getZoneAt reports route tags at proof points.

## Micro Runway

Use `../micro-007-route-annotation-contract/README.md` before implementation. It splits this atom into primary route schema, alternate route schema, branch and return lane schema, route node and segment ids, route corridor budget, route cost/risk tags, getZoneAt route query, route proof points, player guidance parity, AI staging parity, negative fixture cases, and route stale-proof policy.
