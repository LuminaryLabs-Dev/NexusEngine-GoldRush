# Player Guidance Cue

Status: active

## Intent

Make route guidance visible and playable without turning the main game into a debug overlay. The route target, action readiness, and suggested input should come from a GoldRush custom kit, while Three.js only renders the cue.

## Research Inputs

- Game Accessibility Guidelines recommends clear current objectives, contextual in-game guidance, clear indication that interactive elements are interactive, no essential information by color alone, and camera/movement consistency.
- EA Battlefield 6 accessibility materials describe adjustable HUD/icons/crosshair readability, field-of-view/camera controls, reduced camera bob, hold-to-toggle options, and objective tracking that guides players in the right direction.
- Ubisoft Assassin's Creed Shadows accessibility materials describe guided mode, HUD customization, gameplay captions, navigation/pathfinding audio cues, remappable hold/press inputs, and guided first-time experience.

Sources:
- https://gameaccessibilityguidelines.com/full-list/
- https://www.ea.com/able/resources/battlefield-6
- https://news.ubisoft.com/de-de/article/1Y0Q8goho9gJzCV2UBjyUJ/assassins-creed-shadows-accessibility-spotlight

## Domain Decision

- Domain: `n:goldrush:player-guidance-cue`
- Runtime API: `engine.n.goldrushPlayerGuidanceCue`
- Renderer consumer: `goldrush-player-guidance-cue-visual-v1`
- Input kits: `n:goldrush:player-route-guidance`, `n:goldrush:player-action-surface`, `n:control:character-movement`

## AAA Gap Addressed

- Before: route guidance existed as state and proof automation, but the player did not get one authoritative world-facing cue.
- After: the route/action state produces one active diegetic arrow or hold ring with target kind, distance band, shape, input, no color-only dependency, and no debug overlay requirement.

## Remaining Gaps

- Add an accessibility/options kit for cue opacity, scale, hold-to-toggle, and reduced pulse.
- Add audio cue pairs for navigation and hold readiness after approved audio/runtime cue decisions.
- Replace simple procedural arrow/ring geometry with higher-fidelity authored or generated western UI materials.
- Validate the cue in cashout and combat-pressure contexts with public proof, not only resource approach.
