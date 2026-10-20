# Mycelium Primal

**TL;DR:** This repo holds Mycelium Primal, an open-source design system by Mycelium (Niko's software company), built from first principles. It's private and in its first days; it goes public at v1.

## What it is

Primal is meant to be two things. It's a design system you install and use as it is. It's also the base that every future Mycelium design system starts from, so its own look stays minimal and is set through tokens. Its tokens, styles and component contracts don't depend on any framework, and each framework gets its own set of packages. Angular comes first; the others come only when Mycelium needs them.

## What's in here

| Path | What it is |
|---|---|
| `packages/tokens` | The design tokens as CSS custom properties, framework-independent (empty until 0.1.0 fills it) |
| `packages/css` | Reset, base typography and layout in plain CSS (empty until 0.1.0 fills it) |
| `packages/angular` | The Angular adapter (Angular 22+) |
| `apps/showcase` | The live showcase: every planned page, each showing the native HTML it covers until its release builds it |
| `.folio/` | The plan in Folio: the baseline, the ledger of releases 0.1.0 to 1.0.0, and Niko's decisions |

## Run it

Needs Node 24 (`.nvmrc`).

```bash
npm install
npm run build          # the Angular adapter, then the showcase
npx ng serve showcase  # http://localhost:6840
npm run check:folio    # checks the ledger
```

## Status

Active. Release 0.1.0 is in progress: so far the workspace, the showcase shell and CI. Tokens and themes come next.
