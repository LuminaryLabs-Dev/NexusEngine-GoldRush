# Readability Fakeout Register

Status: active docs-only

## Purpose

Track ways GoldRush can appear to improve while still failing the player experience.

| Fakeout | Why it is dangerous | Required hardening |
| --- | --- | --- |
| Nonblank canvas | Proves rendering only, not playability. | Pair with input replay and human-view screenshot/video. |
| Green receipt | Proves state mutation only, not visible interaction. | Require player-facing prompt, action, feedback, and result proof. |
| Dense props | Adds noise without authored composition. | Place from map masks and prove foreground/midground/focal clarity. |
| Camera screenshot | Hides pulsing and same-frame motion conflict. | Use motion samples and camera authority validator. |
| Procedural asset count | Counts objects but not identity. | Require object protokit contract and readability proof. |
| Audio playing | May be wrong cue, loop, or state. | Require semantic cue id, cooldown, and event alignment. |
| Combat damage receipt | Does not prove fair telegraph or counterplay. | Require threat warning, cover route, hit/miss feedback, and receipt. |
| Public link exists | Does not prove deployed build matches local proof. | Run local/public proof pair after player-facing changes. |
