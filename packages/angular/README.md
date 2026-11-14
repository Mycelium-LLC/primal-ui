<p align="center">
  <a href="https://primal.myceliumllc.dev"><img src="https://primal.myceliumllc.dev/brand/primal-mark.png" width="96" height="96" alt="Mycelium Primal"></a>
</p>

<h1 align="center">@mycelium-llc/primal-angular</h1>

<p align="center">Mycelium Primal for Angular 22+: fields, actions, feedback, navigation, dialogs, tables and cells, as standalone, signal-based components and directives that keep a written contract.</p>

<p align="center">
  <a href="https://primal.myceliumllc.dev">Site</a> ·
  <a href="https://primal.myceliumllc.dev/showcase/">Showcase</a> ·
  <a href="https://primal.myceliumllc.dev/showcase/contracts/catalog">Contracts</a> ·
  <a href="https://github.com/Mycelium-LLC/primal-ui">GitHub</a> ·
  <a href="https://github.com/Mycelium-LLC/primal-ui/blob/main/CHANGELOG.md">Changelog</a>
</p>

## Install

```bash
npm install @mycelium-llc/primal-tokens @mycelium-llc/primal-css @mycelium-llc/primal-angular
```

Or start from a working app: `npx degit Mycelium-LLC/primal-ui/starter my-app`.

Load the tokens, then the core styles, then your own theme, in `angular.json`:

```json
"styles": [
  "node_modules/@mycelium-llc/primal-tokens/primal-tokens.css",
  "node_modules/@mycelium-llc/primal-css/src/primal.css",
  "src/my-theme.css"
]
```

Add the router helpers next to your router:

```ts
import { provideRouter } from '@angular/router';
import { providePrimalRouteScroll, withPrimalTransitions } from '@mycelium-llc/primal-angular';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes, withPrimalTransitions()), providePrimalRouteScroll()],
};
```

## In 30 seconds

Import the group you need into a standalone component:

| Import | What's in it |
|---|---|
| `PRIMAL_FORMS` | `primal-field`, `primalControl`, `primal-field-group`, `primalForm`, `primal-select`, `primal-autocomplete`, `primalMask`, `primal-number`, `primal-file-drop` |
| `PRIMAL_ACTIONS` | `primalButton`, `primalIconButton`, `primalLink`, `primal-button-group` |
| `PRIMAL_FEEDBACK` | `primal-alert`, `primal-spinner`, `primal-progress`, `primal-skeleton` (toasts come from `PrimalToaster`) |
| `PRIMAL_NAVIGATION` | `primal-tabs`, `primal-tab`, `primal-pagination`, `primal-menu`, `primalShellMenu`, the skip link `a.pr-skip` |
| `PRIMAL_TOP_LAYERS` | `primal-dialog`, `primal-popover`, `primalTooltip` (confirmations come from `PrimalConfirm`) |
| `PRIMAL_TABLES` | every `<table>` sorts by its columns |
| `PRIMAL_CONTENT` | `primal-code-block`, `primal-avatar`, `primal-empty`, `primal-toolbar` |
| `PRIMAL_CELLS` | `primal-subscribe`, `primal-search` |

```ts
import { Component } from '@angular/core';
import { PRIMAL_ACTIONS, PRIMAL_FORMS } from '@mycelium-llc/primal-angular';

@Component({
  selector: 'app-sign-in',
  imports: [PRIMAL_FORMS, PRIMAL_ACTIONS],
  template: `
    <form primalForm>
      <primal-field label="Email"><input primalControl type="email" autocomplete="username" required /></primal-field>
      <button primalButton type="submit" emphasis="primary" [run]="signIn">Sign In</button>
    </form>
  `,
})
export class SignIn {
  protected readonly signIn = async () => 'Signed in';
}
```

When a row is removed with its own button, call `primalFocusAfterRemove(list)` just before removing it: focus goes to the next row's same button (or the list's heading when none is left), never to the top of the page.

Every component's contract (what it promises, its states, keys, accessibility and markup to copy) is in the [contract catalog](https://primal.myceliumllc.dev/showcase/contracts/catalog).

## Make it yours

Override tokens in your own theme file, loaded after Primal; never edit a component. Your colour is three choices (`--pr-black`, `--pr-white`, `--pr-primary`) and a harmony; the showcase's Colour page writes the file and checks its contrast.


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
