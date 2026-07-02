# Source-First Decision Matrix

Status: active docs-only

## Purpose

Track the required decisions before terrain implementation resumes.

| Decision | Current answer | State | Required proof |
| --- | --- | --- | --- |
| Is the plateau a renderer-only problem? | No. The core gap is missing authored map source. | resolved direction | Plateau audit and human-view screenshots. |
| Should the next terrain pass add more scattered props first? | No. Props must become source-anchored protokit families. | resolved direction | Asset family anchors and placement proof. |
| Should renderer geometry become the source of truth? | No. Renderer geometry is a source-derived view. | resolved boundary | Source revision in renderer snapshot. |
| Should physics sample its own terrain math? | No. Physics must sample source-derived collider data. | resolved boundary | Collider parity validator. |
| Should LOD be added after visuals are done? | No. Chunk and LOD topology must be part of the source contract. | active | LOD seam and no-pop proof. |
| Should the first source fixture be full map scale? | No. Start with a tiny representative fixture. | active | Fixture validator and human route proof. |
| Should digital assets be imported before source anchors exist? | No. Candidate assets need source masks and placement anchors. | active | Protokit placement packet. |
| Should public proof claim AAA map readiness from a local fixture? | No. It can claim only fixture readiness. | active | Proof labels and deploy report. |

## Implementation Gate

The first implementation batch should be allowed only when a selected atom points to:

- owner kit
- source data fixture
- event and snapshot contract
- validator
- human-view proof state
- public proof boundary
- rollback or restart rule

