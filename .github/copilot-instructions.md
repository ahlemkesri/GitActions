<!-- Copilot/AI agent instructions for the GitActions repository -->
# Repository overview

This is a small slide + demo Node project. Key facts an AI coding agent should know before editing or producing code:

- The project uses ESM modules (`"type": "module"` in `package.json`). Use `import`/`export` syntax.
- Main files to inspect for runtime and CI behavior: `server.js`, `package.json`, `Dockerfile`, `test/sum.test.js`, and `.github/workflows/ci.yml`.
- Tests use Node's built-in test runner (`node --test`) — the `test` script in `package.json` runs `node --test`.

# Big-picture architecture

- Slidev-driven site: many scripts are Slidev-related (`@slidev/cli`) and produce builds/exports. See `package.json` scripts such as `dev:dev`, `dev:prod`, `build:dev`, `build:prod`, `export:dev`, `export:prod`.
- Minimal Express demo server: `server.js` provides a simple HTTP entrypoint and `export default app` so the server can be imported in tests or other tooling.
- CI: `.github/workflows/ci.yml` builds and pushes a Docker image to GitHub Container Registry (GHCR) using `docker/metadata-action` and `docker/build-push-action`.

# Project-specific conventions and patterns

- ESM-only: files assume `import`/`export`. Do not switch to CommonJS `require` unless you update `package.json`.
- Tests: use Node's `node:test` API (`import test from 'node:test'`). Keep test files using that pattern instead of adding a different test runner.
- Server export: `server.js` starts the listener when run directly and also `export default app` so CI or tests can import the `app` object. Prefer importing the app for higher-level tests.
- Scripts: some scripts use `pnpm` in their definitions (e.g., `build` delegates to `pnpm build:dev`). The repo contains `dependencies` and `devDependencies` for Slidev and tooling; prefer using the project's package manager (install with `pnpm` or `npm` depending on developer preference).

# Common developer workflows (commands & examples)

- Install dependencies:
  - `pnpm install` (recommended if you use `pnpm` locally)
  - or `npm install`
- Run tests (uses Node's built-in runner):
  - `npm test`  # runs `node --test`
- Run the demo server locally:
  - POSIX: `PORT=3000 node server.js`
  - Windows (cmd): `set PORT=3000 && node server.js`
  - Or simply: `node server.js` (defaults to port 3000)
- Use Slidev dev/build commands (slides are in `slides/`):
  - `pnpm run dev:dev` — dev server for formation-dev
  - `pnpm run build:dev` — build slides to `dist/formation-dev`
- Linting/markdown checks:
  - `pnpm run lint` runs JS and markdown linters (`eslint` and `markdownlint-cli2`).

# CI and Docker notes

- CI workflow (`.github/workflows/ci.yml`) builds/pushes Docker images to GHCR. The `docker` job uses:
  - `docker/metadata-action@v5` to generate tags/labels.
  - `docker/build-push-action@v5` to build and push the image.
- The workflow expects to run on pushes and pushes tags like `branch-<sha>` and `latest` when on default branch.
- If you modify the Docker build or metadata, update `.github/workflows/ci.yml` and `Dockerfile` together.

# Examples of code patterns to follow

- When adding new modules, use ESM imports:
  - `import express from 'express';`
- Tests should import Node builtin test helpers and use `assert` from `node:assert` as current tests do.
- To make services testable, export the app or core functions instead of tightly coupling `listen()` calls. `server.js` already exports `app`.

# Integration points & external dependencies

- Slidev (`@slidev/cli`) for slides and exports.
- Docker + GitHub Container Registry for CI image publishing.
- Playwright is present in devDependencies (likely for visual or integration testing of Slidev exports).

# What *not* to change without coordination

- Do not convert the repo to CommonJS or change `type` in `package.json` without updating all imports/exports.
- Do not remove `export default app` from `server.js` — tests and consumers rely on it.

# If something is unclear

If key information is missing (e.g., preferred package manager `pnpm` vs `npm`, private registry settings, or deploy target), ask maintainers for the intended local development flow and CI expectations before implementing large changes.

---
Please review these instructions and tell me any missing examples or workflows you'd like added.
