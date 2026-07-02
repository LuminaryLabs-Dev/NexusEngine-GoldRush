# Coordinate Scale Data

Status: active docs-only
Atom: 03-02
Family: coordinate-scale
Layer: data
Domain: world/network

## Purpose

The map needs explicit bounds, units, cells, travel times, spawn density, and partition hints.

This atom exists to define the smallest source fields and metadata that must exist.

## Required Source Detail

- Name the source artboard field or annotation.
- Name the expected value range or allowed categories.
- Name the revision metadata required for restart.
- Name the source fixture sample needed before broad terrain work.

## Consumer Boundary

Renderer, physics, placement, gameplay, bot, staging, and proof systems must consume this sheet through a kit or derived descriptor. Hidden renderer constants, duplicate collider math, and gameplay-only placement are invalid for this atom.

## Player-View Acceptance

The player-facing result must improve terrain readability, route confidence, object grounding, combat fairness, extraction clarity, or public proof reliability.

## Stop Condition

Do not resolve this atom until the source field, consuming kit, proof path, and fake-completion risk are documented together.
