# .folio: Mycelium Primal's plan, as Folio loads it

| File | What it is |
|---|---|
| [`prd.json`](prd.json) | The baseline, **0.0.0**: the seed (a README only, 2026-10-20). It declares the nine chapters and holds no requirements, because nothing is built yet. |
| [`ledger.json`](ledger.json) | **The authored plan.** Every release from 0.1.0 to 1.0.0: what it adds, its goal, what Niko sees, its items, rollout and when it's done; plus Niko's decisions (`decisions`) and the questions only he can answer (`questionsForNiko`). |
| [`check-ledger.mjs`](check-ledger.mjs) | Checks the ledger against the PRD (`--fold <version>` prints the requirements at a release). Copied from Fenn. |

## The model

This is the same model Fenn, Meeny and Kyara use. The PRD at release N is the baseline plus every ledger release up to N:
`add` opens a requirement or feature, `change` rewords one, `retire` closes one, and nothing is ever deleted.
Addresses are `primal/<feature>/<requirement>`. Statements never name a screen, store or file.

| Release | Name | State (2026-10-20) |
|---|---|---|
| 0.0.0 | The seed (the baseline) | main @ ab3d82fe, README only |
| 0.1.0 | A base you can make your own (the shell with every page, tokens, themes, both directions) | shipped 2026-10-20 (#1 → 4d0284f, tag 0.1.0) |
| 0.2.0 | Plain HTML reads right (every native element accounted for) | shipped 2026-10-20 (#2 → afc5b00, tag 0.2.0) |
| 0.3.0 | Fields that never leave you guessing (forms) | shipped 2026-11-03 in 0.9.0 (#7 → 7075e36, tag 0.9.0) |
| 0.4.0 | Magma by default (Mycelium's Magma, ink and white; the primary's states and scale) | shipped 2026-11-03 in 0.9.0 (#7 → 7075e36, tag 0.9.0) |
| 0.5.0 | Every action answers (actions, feedback, the behaviour model) | shipped 2026-11-03 in 0.9.0 (#7 → 7075e36, tag 0.9.0) |
| 0.6.0 | You always know where you are (navigation, top layers, focus) | shipped 2026-11-03 in 0.9.0 (#7 → 7075e36, tag 0.9.0) |
| 0.7.0 | Things look like what they are (content, information, layout, first cells) | shipped 2026-11-03 in 0.9.0 (#7 → 7075e36, tag 0.9.0) |
| 0.8.0 | Whole places to work in (reference surfaces) | shipped 2026-11-03 in 0.9.0 (#7 → 7075e36, tag 0.9.0) |
| 0.9.0 | Every element keeps its promise (the contract catalog) | shipped 2026-11-03 in 0.9.0 (#7 → 7075e36, tag 0.9.0) |
| 1.0.0 | Open to everyone (open source, published packages, the acceptance test) | shipped 2026-11-14 (#9 → 1e17565, tag 1.0.0), live at primal.myceliumllc.dev; npm waits on Niko |

## Checking

```bash
node .folio/check-ledger.mjs              # exit 1 on any problem
node .folio/check-ledger.mjs --fold 0.1.0 # the requirements at a release
```

Niko approved the plan on 2026-10-20. It isn't loaded into Folio yet; it gets loaded with HQ's `folio-prd-to-vault.mjs` and
`folio-ledger-to-vault.mjs`, the same scripts Fenn's `.folio/README.md` describes.
