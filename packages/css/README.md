<p align="center">
  <a href="https://primal.myceliumllc.dev"><img src="https://primal.myceliumllc.dev/brand/primal-mark.png" width="96" height="96" alt="Mycelium Primal"></a>
</p>

<h1 align="center">@mycelium-llc/primal-css</h1>

<p align="center">The CSS of Mycelium Primal: a reset and a classless base so every native HTML element reads right, layout and component classes, and Google Sans bundled. Works on any page, with or without a framework.</p>

<p align="center">
  <a href="https://primal.myceliumllc.dev">Site</a> ·
  <a href="https://primal.myceliumllc.dev/showcase/">Showcase</a> ·
  <a href="https://primal.myceliumllc.dev/showcase/contracts/catalog">Contracts</a> ·
  <a href="https://github.com/Mycelium-LLC/primal-ui">GitHub</a> ·
  <a href="https://github.com/Mycelium-LLC/primal-ui/blob/main/CHANGELOG.md">Changelog</a>
</p>

## Install

```bash
npm install @mycelium-llc/primal-tokens @mycelium-llc/primal-css
```

## In 30 seconds

```html
<link rel="stylesheet" href="node_modules/@mycelium-llc/primal-tokens/primal-tokens.css" />
<link rel="stylesheet" href="node_modules/@mycelium-llc/primal-css/src/primal.css" />

<main class="pr-container">
  <h1>Hello</h1>
  <p>Plain HTML already reads right: type, spacing, links, lists, tables, forms.</p>
  <button class="pr-button-primary">Save Changes</button>
</main>
```

Light and dark follow the person's system, and right to left follows `dir="rtl"`. Every element, class and the markup to copy are in the [showcase](https://primal.myceliumllc.dev/showcase/). Never edit Primal's CSS: change the tokens in your own file, loaded after it.

## The Primal packages

| Package | What it is |
|---|---|
| [`@mycelium-llc/primal-tokens`](https://www.npmjs.com/package/@mycelium-llc/primal-tokens) | The design tokens: CSS custom properties and JSON, light and dark |
| [`@mycelium-llc/primal-css`](https://www.npmjs.com/package/@mycelium-llc/primal-css) | Classless CSS: plain HTML reads right, plus layout and component classes |
| [`@mycelium-llc/primal-angular`](https://www.npmjs.com/package/@mycelium-llc/primal-angular) | The Angular 22+ adapter |
| [`@mycelium-llc/primal-contracts`](https://www.npmjs.com/package/@mycelium-llc/primal-contracts) | Every component's contract as JSON, and a checker for your own |

All four share one version. Mycelium Primal is an open-source design system by [Mycelium](https://myceliumllc.dev), built from first principles: use it as it is, or [fork it](https://github.com/Mycelium-LLC/primal-ui/blob/main/docs/fork.md) into your own.

## License

MIT. The Google Sans font files in `src/fonts` are under the SIL Open Font License 1.1 (`src/fonts/OFL.txt`).
