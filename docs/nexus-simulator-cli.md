# NexusSimulator CLI

GoldRush uses the external NexusSimulator project for browser/runtime testing without copying simulator code into this repo.

```txt
GoldRush tracked code
└─ tools/simulator/goldrush-nexus-sim.mjs
   ├─ discovers ../NexusSimulator/NexusSimulator-V1
   ├─ writes generated .nexus-simulator env/scenario files
   ├─ starts the local Vite dev server
   └─ runs nexus-sim scenario check/run with --simtime nexusrealtime
```

## Commands

```bash
npm run sim:discover
npm run sim:test
```

`sim:test` starts GoldRush locally, writes a generated `goldrush-local/goldrush-smoke` scenario, and runs it through the NexusSimulator `nexusrealtime` adapter.

## Scenario Coverage

The generated smoke scenario validates:

- title screen loads
- `window.GameHost` simulator bridge is available
- title enters lobby
- leader starts a 20-player match
- loading-yard train sequence reaches the gold field
- gold-field site is active
- camera-relative WASD state is exposed
- Cannon terrain physics state is exposed
- canvas exists
- browser console has no errors

## State Policy

`.nexus-simulator/` is ignored. It contains generated envs, scenarios, screenshots, and other local simulator artifacts. Durable proof should be promoted into `reports/` or `screenshots/` only when a run is worth retaining.

JSON output is sanitized by default for every command, including `discover`, `write-scenario`, and `run`. Scenario paths, env paths, and artifact paths are emitted as repo-relative paths when they are inside this repo. External simulator paths are reduced to labels such as `<github>/NexusSimulator/NexusSimulator-V1` or basename-only labels so shared reports do not expose local usernames or absolute machine paths. CLI error/help text is sanitized through the same boundary.

The same default applies to retained smoke proofs: report JSON, report Markdown, console summaries, and screenshot references should be repo-relative. Absolute paths are only allowed inside the process while writing files.
