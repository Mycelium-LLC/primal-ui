# @mycelium-llc/primal-tokens

**TL;DR:** Mycelium Primal's design tokens as CSS custom properties (`primal-tokens.css`) and JSON, with light and dark values, plus the colour model that derives every colour role from three choices.

On GitHub Packages: point the scope there in your project's `.npmrc`, with a GitHub token that has `read:packages` in `GITHUB_TOKEN` (needed even for a public package):

```ini
@mycelium-llc:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

```bash
npm install @mycelium-llc/primal-tokens @mycelium-llc/primal-css
```

Load `primal-tokens.css` first, then `@mycelium-llc/primal-css`. Your colour is three custom properties set after them: `--pr-black`, `--pr-white` and `--pr-primary`. Every role (text, surfaces, the primary's states, the system colours) derives from them and meets WCAG 2.2 AA for any black up to 0.22 OKLCH lightness and any white from 0.95. Pick them on the [Colour page](https://primal.myceliumllc.dev/showcase/foundation/colour).

`src/colour-model.mjs` is the same model in JavaScript (`palette`, `audit`), for checking a theme in a build.

Part of [Mycelium Primal](https://primal.myceliumllc.dev) · MIT
