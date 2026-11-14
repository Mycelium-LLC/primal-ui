# @mycelium-llc/primal-angular

**TL;DR:** The Angular adapter of Mycelium Primal, the open-source design system by Mycelium: its fields, actions, feedback, navigation, top layers, content and cells as Angular 22+ components and directives. It needs Primal's two style packages loaded as global styles.

## Install

```bash
npm install @mycelium-llc/primal-tokens @mycelium-llc/primal-css @mycelium-llc/primal-angular
```

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

## Use

Import the group you need into a standalone component:

| Import | What's in it |
|---|---|
| `PRIMAL_FORMS` | `primal-field`, `primalControl`, `primal-field-group`, `primalForm`, `primal-select`, `primal-autocomplete`, `primalMask`, `primal-number`, `primal-file-drop` |
| `PRIMAL_ACTIONS` | `primalButton`, `primalIconButton`, `primalLink`, `primal-button-group` |
| `PRIMAL_FEEDBACK` | `primal-alert`, `primal-spinner`, `primal-progress`, `primal-skeleton` (toasts come from `PrimalToaster`) |
| `PRIMAL_NAVIGATION` | `primal-tabs`, `primal-tab`, `primal-pagination`, `primal-menu` |
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

Every component's contract (what it promises, its states, keys, accessibility and markup to copy) is in the showcase's contract catalog, `/contracts/catalog`.

## Make it yours

Override tokens in your own theme file, loaded after Primal; never edit a component. Your colour is three choices (`--pr-black`, `--pr-white`, `--pr-primary`) and a harmony; the showcase's Colour page writes the file and checks its contrast.

## License

Private until Primal 1.0.0.
