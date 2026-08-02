# Contributing

NexusEngine Gold Rush is a public browser-game rebuild with strict boundaries
between reusable domain behavior, Gold Rush rules, rendering, imported source
evidence, reviewed assets, and public runtime files.

## Start Here

Read these files before changing the repository:

1. [AGENTS.md](AGENTS.md)
2. [memory.md](memory.md)
3. [goal.md](goal.md)
4. [.agent/start-here.md](.agent/start-here.md)
5. [docs/reality-status.md](docs/reality-status.md)

Follow the active version packet named by the repository's `.agent` workflow.
Do not clone legacy Gold Rush or Nexus runtime repositories into this workflow.

## Ownership Boundaries

- Put reusable behavior in neutral generic kits and Gold Rush-specific rules in
  Gold Rush kits.
- Keep renderers presentation-only; state, receipts, scoring, and validation
  remain kit-owned.
- Treat `raw/`, `quarantine/`, and `sanitized/` as intake and review boundaries,
  never as browser runtime imports.
- Promote assets only after provenance, license, human-review, hash, and runtime
  path gates pass. Approved browser assets live under `public/assets/`.
- Keep retained reports and proof artifacts public-safe and sanitized.

## Validation

Run the authoritative local gate:

```bash
npm run check
```

Use focused validators and Playwright proofs for the changed behavior. Report
the exact commands, results, unresolved blockers, and whether evidence is local,
simulated, or public. Do not describe procedural or placeholder content as final
legacy parity.

## Pull Requests

- Keep one coherent purpose per pull request.
- Explain affected domains, kits, runtime surfaces, and promotion boundaries.
- Include sanitized evidence for player-facing changes.
- Do not commit credentials, private paths, browser profiles, unreviewed source
  assets, or generated local output.
- Do not deploy or promote imported assets without the explicit gates documented
  in [docs/asset-ingestion-policy.md](docs/asset-ingestion-policy.md).
