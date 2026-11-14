# @mycelium-llc/primal-css

**TL;DR:** Mycelium Primal's CSS: a reset, a classless base that makes every native HTML element read right, the components' styles, and Google Sans bundled. Works on any web page, with or without a framework.

On GitHub Packages: point the scope there in your project's `.npmrc`, with a GitHub token that has `read:packages` in `GITHUB_TOKEN` (needed even for a public package):

```ini
@mycelium-llc:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

```bash
npm install @mycelium-llc/primal-tokens @mycelium-llc/primal-css
```

```html
<link rel="stylesheet" href="node_modules/@mycelium-llc/primal-tokens/primal-tokens.css" />
<link rel="stylesheet" href="node_modules/@mycelium-llc/primal-css/src/primal.css" />
```

Every value comes from the tokens, so light, dark and right to left follow on their own. Components and the markup to copy are in the [showcase](https://primal.myceliumllc.dev/showcase/). Google Sans is under the SIL Open Font License (`src/fonts/OFL.txt`).

Part of [Mycelium Primal](https://primal.myceliumllc.dev) · MIT
