# Security Policy

## Scope

This public repository contains a browser game, multiplayer scaffolding, proof
automation, asset-intake tooling, and public artifact sanitization. Security
reports should distinguish runtime issues from import-pipeline, provenance,
credential, and retained-evidence issues.

## Reporting

A dedicated public reporting address is not documented. Contact a maintainer
through an existing private channel before publishing exploitable details. Do
not place tokens, cookies, private paths, source credentials, account data,
unreviewed legacy assets, or weaponized proof material in a public issue.

Include:

- the affected commit and repository-relative paths;
- reproduction steps and observed impact;
- whether the issue affects the public build, local tooling, multiplayer, or
  asset intake; and
- sanitized logs or screenshots.

## Sensitive Boundaries

- Legacy source content must enter through the documented cloud transfer,
  quarantine, provenance, conversion, review, and promotion gates.
- Runtime code must not import from `raw/`, `quarantine/`, or `sanitized/`.
- Only approved, hash-verified browser assets may be referenced from
  `public/assets/`.
- Reports and proof output must use the shared public artifact sanitizer.
- Local browser profiles, absolute home paths, account identifiers, query
  secrets, keys, and tokens must not enter retained artifacts.

Run the repository security and publication gates through `npm run sanitize`
and `npm run check`. Supported-version and response-time commitments are not
currently specified.
