# Proof And Agent Workflow Feedback

Status: active

## Purpose

Preserve user corrections about how agents, GPT-it, proof, screenshots, and videos should operate.

## Feedback

- Use the repo-local `.agent` workspace as the operating layer.
- Track goals in `goal.md` and durable changes in `memory.md` or `.agent/memory.md`.
- Keep a change log.
- Use GPT-it for cloud/browser reasoning when requested, but first ask it to find/read/explain intent before asking it to execute.
- GPT-it output should be domain-based and scoped, not loose paragraphs.
- For live testing, launch a debug session, let the user play, accept one thing to change, implement, validate, screenshot, and repeat.
- Take screenshots of both local and public states; sometimes record video when motion matters.
- Use video for pulsing, camera movement, train timing, and interaction timing.
- Sanitize reports by default; avoid leaking local paths, account details, or raw source paths in public/shareable artifacts.

## Required Proof

- `.agent/change-log.md` gets one-line entries for meaningful changes.
- `reports/` and `screenshots/` retain durable proof.
- `output/` remains scratch for transient recordings.
- Local/public audits distinguish game failures from proof-harness/browser-control failures.
