# Scene Site Kit Stack

Status: active docs-only

## Purpose

Name the expected kit groups by player-facing site so future implementation can load only the systems needed for that site.

## Sites

| Site | Primary purpose | Required slices |
| --- | --- | --- |
| site.start | Identity, audio, first action | title-audio-entry, runtime-domain-registry, scene-site-loader |
| site.lobby-character | Party code, character identity, group config | lobby-party-character-preview, group-selection-match-config |
| site.loading-yard | Train arrival, boarding, party sync, handoff | train-loading-sequence, train-boarding-party-sync |
| site.gold-field | World, movement, mining, cargo, combat, extraction | gold-field-spawn-map-source, third-person-controller, terrain-grounding-physics, resource-discovery-protokits, mining-hold-action, cargo-carry-risk, threat-ambush-pressure, cover-combat-route, cashout-extraction-sites |
| site.results | Scoring, replay, restart | scoring-results-replay, deploy-proof-restart |
| staging | Single-player scenario and bot fill | bot-fill-staging, sixty-player-room-scale |
| public-build | Published proof and restart safety | deploy-proof-restart |

## Site Rule

A site may consume snapshots from previous sites, but it should not keep previous-site transient control authority alive after transition.

