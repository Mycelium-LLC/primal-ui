# Contributing to Mycelium Primal

**TL;DR:** Open an issue before a pull request, keep every value a token, give every component a contract, and run the four checks before you push.

Primal is built by Mycelium and used in its products, so its direction is set by its plan in [`.folio/`](.folio/README.md). Bug reports, fixes and documentation are always welcome. For a new component or a change to how something behaves, open an issue first and say what you need it for: Primal adds a behaviour only when a real product needs it.

## Set up

Needs Node 24 (`.nvmrc`).

```bash
git clone https://github.com/Mycelium-LLC/primal-ui.git
cd primal-ui
npm install
npx ng serve showcase      # the showcase, with every component
```

## The rules a change must keep

- **Every value is a token.** No literal colour, length or duration in a component's CSS; `npm run check:tokens` fails the build on one.
- **Every component has a contract** in `packages/contracts/src/<id>.json`: what it promises, its states, keys, accessibility and the markup to copy. `npm run check:contracts` fails on a missing or thin one.
- **Native HTML first.** A component wraps the native element and keeps its behaviour; it never replaces a `<button>`, `<input>` or `<dialog>` with a `<div>`.
- **Both directions.** Logical properties only (`margin-inline-start`, never `margin-left`). Check every change right to left.
- **Light and dark, and contrast.** Every colour pair meets WCAG 2.2 AA; the token check measures them.
- **Labels are a verb and a noun** ("Save Changes", "Delete Report"), never "Submit" or "OK".

## Before you push

```bash
npm run check:tokens
npm run check:contracts
npm test
npm run build
```

CI runs the same checks on every pull request.

## Pull requests

- One change per pull request, with a sentence on what a person using it will see differently.
- A behaviour change updates its contract and its showcase page in the same pull request.
- By contributing, you agree your work is licensed under the [MIT License](LICENSE).
