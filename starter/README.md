# My Primal App

**TL;DR:** An Angular 22 app with Mycelium Primal already set up, and one first screen to grow from: a list of projects, its empty state, a dialog that creates one, and a delete you can undo.

## Start

```bash
npx degit Mycelium-LLC/primal-ui/starter my-app
cd my-app
npm install
npm start          # http://localhost:4200
```

## What's set up

- `angular.json` loads Primal's tokens, then its CSS, then `src/styles.css`, your theme.
- `src/app/app.config.ts` turns on Primal's page transitions and route scrolling.
- `src/app/projects/` is the first screen. Every behaviour in it (busy buttons, focus kept after a delete, the toast's Undo) comes from Primal; the projects live in memory until you bring your data.

## Make it yours

Set your black, white and primary in `src/styles.css`. Pick them on Primal's [Colour page](https://primal.myceliumllc.dev/showcase/foundation/colour), which checks every pair for contrast. Every component, its states and the markup to copy are in the [showcase](https://primal.myceliumllc.dev/showcase/).
