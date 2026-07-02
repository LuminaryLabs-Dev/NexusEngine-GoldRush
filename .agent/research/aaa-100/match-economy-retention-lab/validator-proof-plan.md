# Validator Proof Plan

Status: active docs-only

## Future Validators

- validate-run-value-ladder.mjs
- validate-gold-economy-ledger.mjs
- validate-loot-and-tool-table.mjs
- validate-claim-contract-objectives.mjs
- validate-risk-reward-tiers.mjs
- validate-extraction-stakes.mjs
- validate-final-rush-pressure-economy.mjs
- validate-squad-share-rules.mjs
- validate-bot-fill-reward-boundary.mjs
- validate-replay-lesson-loop.mjs
- validate-progression-boundary.mjs
- validate-claim-challenge-rotation.mjs
- validate-prospector-identity-boundary.mjs
- validate-balance-ledger.mjs
- validate-economy-fairness.mjs
- validate-economy-release-policy.mjs

## Proof Order

1. Run CLI data validator.
2. Run deterministic scenario simulation.
3. Run local human-view proof for visible economy states.
4. Run public proof after deploy.
5. Compare local and public economy ruleset ids.
6. Update matrix status only after receipts, visuals, and mode eligibility agree.
