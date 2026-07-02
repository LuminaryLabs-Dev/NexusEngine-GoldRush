# Format And Conversion - Validator Research

Status: planned docs-only
Related gate: ../gates/05-03-format-and-conversion-validator.md

## Research Lens

Poly Haven publishes CC0 assets useful for HDRI, texture, and material reference, but realistic scans usually need toon adaptation and performance budgets before GoldRush runtime use.

## Domain Implication

The phase belongs to `content/pipeline` and should stay separate from renderer-only logic. Renderer code may consume approved snapshots, but it must not invent license, provenance, approval, placement, or gameplay meaning.

## Design Implication

GoldRush needs high-fidelity toon western content, but every asset must remain traceable to a terrain, gameplay, presentation, or feedback role. The right question is not only whether an asset is legal; it is whether it improves map readability, interaction clarity, extraction pressure, or player identity.

## Data Implication

The next implementation packet should expose only the fields needed for this phase:

- `inputFormat`
- `outputFormat`
- `conversionTool`
- `conversionStatus`
- `unsupportedFields`

## Validation Implication

A successful validator must prove both sides:

- valid records can advance one phase.
- invalid, incomplete, or unreviewed records cannot jump to runtime.

## Human-View Implication

If the asset is visual, the proof must include foreground, midground, and gameplay-context readability. If the asset is audio, the proof must include the cue state and the exact game beat that triggered it. If the asset is data-only, the proof must include a sanitized report and no runtime promotion side effect.

## External References

- GitHub Game Engines collection: https://github.com/collections/game-engines
- GitHub JavaScript Game Engines collection: https://github.com/collections/javascript-game-engines
- EA Help Apex game modes: https://help.ea.com/en/articles/apex-legends/game-modes/
- PUBG official game overview: https://pubg.com/en/game-info/overview
- Hunt Showdown game modes reference: https://huntshowdown.fandom.com/wiki/Game_Modes
- Kenney support/license notes: https://kenney.nl/support
- Quaternius free asset catalog: https://quaternius.com/
- Poly Haven license: https://polyhaven.com/license
- OpenGameArt FAQ: https://opengameart.org/content/faq

## Restart Question

If this phase fails, should the team repair the asset record, replace the source, split the asset family, or create a smaller local protokit?

