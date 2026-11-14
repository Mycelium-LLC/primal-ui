<p align="center">
  <a href="https://primal.myceliumllc.dev"><img src="https://primal.myceliumllc.dev/brand/primal-mark.png" width="96" height="96" alt="Mycelium Primal"></a>
</p>

<h1 align="center">@mycelium-llc/primal-contracts</h1>

<p align="center">Every Mycelium Primal component's contract as framework-independent JSON: what it promises, its states, keys, accessibility, failures and the markup to copy. With the schema, and a checker for your own.</p>

<p align="center">
  <a href="https://primal.myceliumllc.dev">Site</a> ·
  <a href="https://primal.myceliumllc.dev/showcase/">Showcase</a> ·
  <a href="https://primal.myceliumllc.dev/showcase/contracts/catalog">Contracts</a> ·
  <a href="https://github.com/Mycelium-LLC/primal-ui">GitHub</a> ·
  <a href="https://github.com/Mycelium-LLC/primal-ui/blob/main/CHANGELOG.md">Changelog</a>
</p>

## Install

```bash
npm install --save-dev @mycelium-llc/primal-contracts
```

## In 30 seconds

Check a folder of your own contracts against Primal's schema:

```bash
npx primal-contracts-check contracts/
```

Or without installing:

```bash
npx -p @mycelium-llc/primal-contracts primal-contracts-check contracts/
```

The folder must hold contracts only: every `.json` in it is read as one, named for its `id`. Read Primal's own from code:

```js
import catalog from '@mycelium-llc/primal-contracts/contracts.json' with { type: 'json' };
console.log(catalog.contracts.length); // every primitive, cell and surface
```

`schema.json` is the shape a contract takes. Browse them all in the [contract catalog](https://primal.myceliumllc.dev/showcase/contracts/catalog).

## The Primal packages

| Package | What it is |
|---|---|
| [`@mycelium-llc/primal-tokens`](https://www.npmjs.com/package/@mycelium-llc/primal-tokens) | The design tokens: CSS custom properties and JSON, light and dark |
| [`@mycelium-llc/primal-css`](https://www.npmjs.com/package/@mycelium-llc/primal-css) | Classless CSS: plain HTML reads right, plus layout and component classes |
| [`@mycelium-llc/primal-angular`](https://www.npmjs.com/package/@mycelium-llc/primal-angular) | The Angular 22+ adapter |
| [`@mycelium-llc/primal-contracts`](https://www.npmjs.com/package/@mycelium-llc/primal-contracts) | Every component's contract as JSON, and a checker for your own |

All four share one version. Mycelium Primal is an open-source design system by [Mycelium](https://myceliumllc.dev), built from first principles: use it as it is, or [fork it](https://github.com/Mycelium-LLC/primal-ui/blob/main/docs/fork.md) into your own.

## License

MIT
