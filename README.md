# Mycelium Primal

**TL;DR:** An open-source design system where every element keeps a written promise. Use it as it is in Angular (or its CSS on any web page), or make it the base of your own design system.

**[primal.myceliumllc.dev](https://primal.myceliumllc.dev)** · [Showcase](https://primal.myceliumllc.dev/showcase/) · [Contract catalog](https://primal.myceliumllc.dev/showcase/contracts/catalog) · [Changelog](CHANGELOG.md) · MIT

## Why Primal

- **Every element keeps a promise.** Each of its 53 parts has a contract: what it promises, its states, keys, accessibility and the markup to copy. The contracts are plain JSON, and a checker keeps yours just as complete.
- **Your brand in three choices.** Pick a black, a white and a primary; every colour role derives from them in light and dark, and every pair is measured against WCAG 2.2 AA.
- **Native first.** Real `<button>`, `<input>`, `<dialog>` and popovers, with keyboard and screen readers handled, never a `<div>` dressed as one.
- **Right to left and dark from the start.** Every rule is a logical property and every colour has its dark value.

## Install Primal

Primal's packages are on GitHub Packages, under `@mycelium-llc`. GitHub Packages asks for a GitHub token even to install a public package, so point the scope there once, in your project's `.npmrc`:

```ini
@mycelium-llc:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

and give it a token: a GitHub personal access token (classic) with the `read:packages` scope, in `GITHUB_TOKEN` (in CI, the workflow's own `GITHUB_TOKEN` with `permissions: packages: read`). Then, in an Angular 22 project:

```bash
npm install @mycelium-llc/primal-tokens @mycelium-llc/primal-css @mycelium-llc/primal-angular
```

Load the styles in `angular.json`, tokens first, then your own theme:

```json
"styles": [
  "node_modules/@mycelium-llc/primal-tokens/primal-tokens.css",
  "node_modules/@mycelium-llc/primal-css/src/primal.css",
  "src/styles.css"
]
```

Then import what you need into a component:

```ts
import { PRIMAL_ACTIONS, PRIMAL_FORMS } from '@mycelium-llc/primal-angular';
```

Or start from the starter, a working app with Primal already set up:

```bash
npx degit Mycelium-LLC/primal-ui/starter my-app
cd my-app && npm install && npm start
```

Not on Angular? The two CSS packages work on any web page: link `primal-tokens.css`, then `primal.css`. The adapter's [README](packages/angular/README.md) and the showcase's [Getting started](https://primal.myceliumllc.dev/showcase/start) go further.

## Fork Primal

To make Primal the base of your own design system, with your name, your colour and your contracts, press **Use this template** on GitHub and follow the [fork guide](docs/fork.md).

## What's in here

| Path | What it is |
|---|---|
| `packages/tokens` | The design tokens and the colour model, framework-independent, built to CSS and JSON |
| `packages/css` | The reset, the classless base for every native element, the components' CSS, and Google Sans |
| `packages/angular` | The Angular adapter (Angular 22+) |
| `packages/contracts` | Every component's contract as JSON, the schema, and `primal-contracts-check` for your own |
| `apps/showcase` | The showcase: every component, its states and its contract |
| `apps/site` | The landing page at primal.myceliumllc.dev, on Primal's own CSS |
| `starter` | A small Angular app with Primal set up, to copy |
| `.folio/` | The plan: every release, its requirements and the decisions behind them |

## Work on Primal

Needs Node 24 (`.nvmrc`).

```bash
npm install
npx ng serve showcase   # http://localhost:6840
npm test                # the adapter's unit tests
npm run build           # tokens, contracts, the adapter and the showcase
npm run build:site      # the landing page and the showcase, as served
npm run pack            # the four packages as dist/packs/*.tgz
```

Read [CONTRIBUTING](CONTRIBUTING.md) first. Security reports go through [SECURITY](SECURITY.md).

## Status

Primal 1.0.0, the first public release, shipped on 2026-11-14. 0.1.0 to 0.9.0 came before it (see the [changelog](CHANGELOG.md)).

## License

[MIT](LICENSE), © Mycelium LLC. Google Sans is bundled under the SIL Open Font License.
