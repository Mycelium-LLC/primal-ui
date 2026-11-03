# Field Notes (Primal acceptance app)

**TL;DR:** A small team notes and projects app built only from Mycelium Primal 1.0.0: the proof that a developer can install Primal and build a whole responsive app without inventing interface behaviour. All data is mock and lives in memory (`src/app/data.ts`).

## Run it

```bash
npm install          # installs @mycelium-llc/primal-* ^1.0.0
npx ng build         # production build, base href /demo/
```

Any email and password sign in (fake auth, in memory); a reload starts over.

## What it covers

| Journey | Address | Primal pieces |
|---|---|---|
| Sign in, sign up, reset | `/sign-in`, `/sign-up`, `/reset` | `.pr-auth`, `primalForm`, `primalButton [run]` |
| App shell | every signed-in place | `.pr-shell`, `primal-menu`, `primal-avatar` |
| Projects | `/projects` | sortable `<table>` (`PRIMAL_TABLES`), `primal-empty`, `primal-dialog`, `primal-select`, `PrimalToaster` Undo, `primalFocusAfterRemove` |
| Project | `/projects/<slug>` | `primal-tabs`, `.pr-breadcrumbs`, `.pr-details`, `.pr-list-items` |
| Teams, New Team | `/teams`, `/teams/new?step=` | `.pr-steps`, `primal-field-group`, `primal-alert` |
| Settings | `/settings/<section>` | `.pr-split`, `.pr-nav-list`, switches, `PrimalPreferences` (theme, direction), `PrimalConfirm` |

Light, dark and right to left are switched in Settings, Appearance.
