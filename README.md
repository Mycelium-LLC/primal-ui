# Mycelium Primal

**TL;DR:** This repo holds Mycelium Primal, an open-source design system by Mycelium (Niko's software company), built from first principles. It's private and in its first days; it goes public at v1.

## What it is

Primal is meant to be two things. It's a design system you install and use as it is. It's also the base that every future Mycelium design system starts from, so its own look stays minimal (Mycelium's Magma on ink and white) and is set through tokens. Its tokens, styles and component contracts don't depend on any framework, and each framework gets its own set of packages. Angular comes first; the others come only when Mycelium needs them.

## What's in here

| Path | What it is |
|---|---|
| `packages/tokens` | The design tokens and the colour model, framework-independent, built to CSS and JSON |
| `packages/css` | The reset and the classless base for every native element, Google Sans, and the coverage inventory |
| `packages/angular` | The Angular adapter (Angular 22+) |
| `packages/contracts` | Every component's contract as framework-independent JSON, the schema, and `primal-contracts-check` for your own; the catalog is generated from it |
| `apps/showcase` | The live showcase: every planned page, each showing the native HTML it covers until its release builds it |
| `.folio/` | The plan in Folio: the baseline, the ledger of releases 0.1.0 to 1.0.0, and Niko's decisions |

## Run it

Needs Node 24 (`.nvmrc`).

```bash
npm install
npm run build          # the Angular adapter, then the showcase
npx ng serve showcase  # http://localhost:6840
npm run check:folio    # checks the ledger
npm run check:contracts # every component has a complete contract
npm run pack           # the four packages as dist/packs/*.tgz, to install in another project
npm test               # the Angular adapter's unit tests
```

## Status

Active. 0.1.0 (the foundation) and 0.2.0 (plain HTML) are shipped. 0.3.0 to 0.9.0 (forms, Magma, actions and feedback, navigation and top layers, content and cells, reference surfaces, the contract catalog) are built in `release/0.9.0`, QA'd twice (C, then B) and fixed after each; they ship together. 1.0.0 (open to everyone) waits on four questions in `.folio/`: the name's trademark check, the npm scope, the license and where the showcase is hosted.
