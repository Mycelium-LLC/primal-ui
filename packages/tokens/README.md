<p align="center">
  <a href="https://primal.myceliumllc.dev"><img src="https://primal.myceliumllc.dev/brand/primal-mark.png" width="96" height="96" alt="Mycelium Primal"></a>
</p>

<h1 align="center">@mycelium-llc/primal-tokens</h1>

<p align="center">The design tokens of Mycelium Primal: every colour, size, space, radius, motion and type value, as CSS custom properties and JSON, in light and dark.</p>

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

Load the tokens, then Primal's CSS, then your theme:

```html
<link rel="stylesheet" href="node_modules/@mycelium-llc/primal-tokens/primal-tokens.css" />
<link rel="stylesheet" href="node_modules/@mycelium-llc/primal-css/src/primal.css" />
<style>
  /* Your colour is three choices; every other role derives from them, in light and dark. */
  :root {
    --pr-black: #17140f;
    --pr-white: #fdfbf8;
    --pr-primary: #0e8763;
  }
</style>
```

Every role (text, surfaces, the primary's states, the system colours) meets WCAG 2.2 AA for any black up to 0.22 OKLCH lightness and any white from 0.95. Pick yours on the [Colour page](https://primal.myceliumllc.dev/showcase/foundation/colour), which writes the file and checks every pair.

`primal-tokens.json` holds every token with its value and meaning. `@mycelium-llc/primal-tokens/colour-model` is the same colour model in JavaScript (`palette`, `audit`), to check a theme in your build.

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
