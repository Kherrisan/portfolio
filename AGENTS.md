# Repository Guidelines

## Project Structure & Module Organization

This is a Next.js 13 portfolio using TypeScript, React, Tailwind CSS,
styled-components, and twin.macro. Route components live in `pages/`, including
API routes under `pages/api/`. Reusable UI lives in `components/`, shared service
and data helpers in `lib/`, site data in `config/`, global styling in `styles/`,
and static assets in `public/`. Operational notes and migration references are
kept in `docs/` and root-level Markdown files. Utility scripts are in `scripts/`;
deployment publishing logic is in `ci/`.

## Build, Test, and Development Commands

Use Yarn 1.x, as declared in `package.json`.

- `yarn dev`: start the local Next.js development server.
- `yarn build`: create a production build and catch type/build errors.
- `yarn start`: serve the production build after `yarn build`.
- `yarn lint`: run Next.js ESLint checks.
- `yarn format`: format source files in `components`, `config`, `lib`, `pages`,
  and `styles` with Prettier.
- `yarn export`: export static output with Next.js.
- `yarn publish`: build, export, and run `ci/publish.ts`.
- `yarn test:proxy`: run the Notion proxy test script.
- `yarn list:databases`: list available Notion databases for configuration work.

## Coding Style & Naming Conventions

Use 2-space indentation, single quotes, no semicolons, trailing commas where
valid in ES5, and an 80-character print width. Imports are sorted by Prettier
with React imports first, then Next.js imports, then local/other imports.
Components use PascalCase file names, for example
`components/SearchModal.tsx`. Pages follow Next.js routing conventions,
including dynamic routes such as `pages/blog/[slug].tsx`. Keep config modules
small and data-oriented.

## Testing Guidelines

There is no general unit-test suite configured. Before submitting changes, run
`yarn lint` and `yarn build`. For Notion proxy or database-related changes, also
run `yarn test:proxy` or `yarn list:databases` as appropriate. Add focused tests
or scripts when introducing behavior that cannot be verified through lint/build.

## Commit & Pull Request Guidelines

Recent history uses very short commit subjects such as `Fix`, `Vul`, and `ABC`.
Prefer improving on that with concise imperative subjects that name the change,
for example `Fix Notion image fallback` or `Update project config`. Pull requests
should include a short summary, validation steps run, linked issues when
available, and screenshots or screen recordings for visible UI changes.

## Security & Configuration Tips

Do not commit secrets from `.env` or `.env.local`. When changing Notion, Tencent
COS, Backblaze, or proxy behavior, update the relevant setup notes in `docs/` or
the root migration guides so deployment configuration stays reproducible.
