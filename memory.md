# Repo Memory

## Purpose

`NexusEngine-GoldRush` is the destination repo for the modern Gold Rush rebuild. It should become a static-browser-deployable game backed by NexusRealtime-style kit composition and room orchestration.

## Architecture Decisions

- Keep this repo as the only local checkout for the Gold Rush rebuild workflow.
- Treat legacy repositories as cloud-side source inputs only.
- Raw legacy data must land in `raw/imported/<jobId>/`.
- Sanitation and conversion outputs must land in `sanitized/`.
- Runtime app assets must land in `public/assets/`.
- Game code should compose domain kits instead of hiding reusable behavior in renderer code.
- Renderers own presentation only.
- Room shards target 50 players each, with multi-room orchestration for 2-100 player matches.

## Current Scaffold

- Vite static app.
- Three.js presentation surface.
- Gold Rush room orchestration data model.
- Import/sanitize validation placeholder.
- GitHub Actions deploy workflow for the `Build` branch.
