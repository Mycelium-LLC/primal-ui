# Fork Primal: make your own design system on it

**TL;DR:** Make your copy from the template, set your three colours and your type in one file, rename the packages, and write a contract for everything you add. You never edit a Primal component: you change its tokens, or add your own beside it.

There are two ways to build on Primal, and this guide is the second:

- **Use it as it is**, with your theme file loaded after it. Best when you want Primal's components and updates. See the [README](../README.md#install-primal).
- **Fork it** into your own design system, with your own name, packages and showcase. Best when you're a team with a brand and your own components to add. Your copy stops following Primal's releases unless you merge them in.

## 1. Make your copy

On [github.com/Mycelium-LLC/primal-ui](https://github.com/Mycelium-LLC/primal-ui), press **Use this template**, then **Create a new repository**. You get a fresh repository with no history of ours.

```bash
git clone https://github.com/<you>/<your-system>.git
cd <your-system>
npm install
npx ng serve showcase      # http://localhost:6840
```

## 2. Your colour: three choices

Open the showcase's **Colour** page. Pick your black, your white and your primary, then a harmony; the page derives every role in light and dark and measures every pair against WCAG 2.2 AA, so you see a miss the moment you make it.

To make them your system's defaults, put the same three values in `packages/tokens/src/colour-model.mjs`, under `INPUTS` (as OKLCH: lightness 0–1, chroma, hue), and the harmony in `DEFAULT_SCHEME`. Then:

```bash
node packages/tokens/build.mjs   # writes primal-tokens.css and .json from your values
npm run check:tokens             # fails if a colour pair misses AA, or a component uses a literal value
```

## 3. Your type, spacing and shape

Everything else lives in `packages/tokens/src/tokens.mjs`: the font families, the type scale (a minimum and a maximum size per step), the three gaps, the radii and the motion. Each token has a `meaning`; keep the meaning, change the value. To use your own font, replace the files in `packages/css/src/fonts` and their `@font-face` rules in `google-sans.css`.

## 4. Your name

- Rename the four packages in `packages/*/package.json` (`@your-scope/your-system-tokens`, and so on) and the import path in `tsconfig.json`.
- Change every import of the Angular package to your name. The showcase, the acceptance app, the starter and the contracts all import it, so do it in one pass and check nothing is left:

  ```bash
  grep -rl "@mycelium-llc/primal-" --include='*.ts' --include='*.mjs' --include='*.json' --include='*.md' --include='*.html' --exclude-dir=node_modules --exclude-dir=dist . \
    | xargs sed -i.bak 's#@mycelium-llc/primal-#@your-scope/your-system-#g' && find . -name '*.bak' -not -path './node_modules/*' -delete
  grep -rn "@mycelium-llc/primal-" --exclude-dir=node_modules --exclude-dir=dist .   # prints nothing
  npm install && npm run build
  ```
- Change the showcase's name in `apps/showcase/src/app/app.html` and its title in `apps/showcase/src/index.html`.
- Keep the `pr-` prefix of the CSS classes and custom properties unless you have a reason: it's in every component's CSS, and changing it means a search-and-replace across `packages/css` and `packages/angular`.

## 5. Your own components, with contracts

A new component goes beside Primal's, never inside one. Give it a contract in `packages/contracts/src/<id>.json`, the same shape as Primal's: what it promises, what people expect of it, its states, keys, accessibility, failures, and the markup to copy. Then:

```bash
node packages/contracts/build.mjs   # rebuilds contracts.json from src/
npm run check:contracts             # every contract complete, every Angular part has one
```

In another repository, check a folder of your contracts with the published checker. The folder must hold contracts only, since every `.json` in it is read as one:

```bash
npx -p @mycelium-llc/primal-contracts primal-contracts-check contracts/
```

## 6. Ship it

`npm run build` builds everything, and `npm run pack` writes your packages as tarballs to try in a real project before you publish. The publish workflow in `.github/workflows/publish.yml` publishes them to npm on a version tag, once you set the scope and an `NPM_TOKEN` secret.

## What to remove or replace

Some files are Mycelium's own, for running Primal itself; a copy should drop or replace them:

- `.github/workflows/deploy.yml` and `firebase.json`: they deploy to Mycelium's site, and only Mycelium's repository can sign in. Delete them, or point them at your own hosting.
- `.folio/`: the plan and decisions behind Primal's releases. Keep it as history, or replace it with your own plan; `npm run check:folio` and CI read it, so remove that step from `.github/workflows/ci.yml` if you delete the folder.
- `docs/qa/`: Primal's QA records. Your releases get their own.

## What you keep from Primal

Every rule in [CONTRIBUTING](../CONTRIBUTING.md) is what makes Primal hold, and it's worth keeping in your copy: every value a token, every component a contract, native elements first, logical properties for both directions, and labels that say what happens.
