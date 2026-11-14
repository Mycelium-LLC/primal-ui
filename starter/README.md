# My Primal App

**TL;DR:** An Angular 22 app with Mycelium Primal already set up, and one first screen to grow from: a list of projects, its empty state, a dialog that creates one, and a delete you can undo.

## Start

Primal's packages are on GitHub Packages, and the starter's `.npmrc` already points `@mycelium-llc` there. GitHub Packages asks for a token even to install a public package: set `GITHUB_TOKEN` to a GitHub personal access token (classic) with the `read:packages` scope.

```bash
npx degit Mycelium-LLC/primal-ui/starter my-app
cd my-app
export GITHUB_TOKEN=<your token with read:packages>
npm install
npm start          # http://localhost:4200
```

## What's set up

- `angular.json` loads Primal's tokens, then its CSS, then `src/styles.css`, your theme.
- `src/app/app.config.ts` turns on Primal's page transitions and route scrolling.
- `src/app/projects/` is the first screen. Every behaviour in it (busy buttons, focus kept after a delete, the toast's Undo) comes from Primal; the projects live in memory until you bring your data.

## Make it yours

Set your black, white and primary in `src/styles.css`. Pick them on Primal's [Colour page](https://primal.myceliumllc.dev/showcase/foundation/colour), which checks every pair for contrast. Every component, its states and the markup to copy are in the [showcase](https://primal.myceliumllc.dev/showcase/).
