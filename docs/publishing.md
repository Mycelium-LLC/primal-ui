# Publishing Primal to npm

**TL;DR:** A release tag publishes the four packages to npmjs through npm Trusted Publishing (GitHub's OIDC token, no npm token stored). npm can only trust a publisher for a package that already exists, so each package's first version is published by hand once, and then its trusted publisher is set.

The npm account is `myceliumllc` (hello@myceliumllc.dev) and the organisation is `mycelium-llc`, which owns the `@mycelium-llc` scope.

## Once: the first version of each package, by hand

From a clone at the release tag, signed in to npm as `myceliumllc` (two-factor authentication asks for a code on each publish):

```bash
git clone https://github.com/Mycelium-LLC/primal-ui.git && cd primal-ui
git checkout 1.0.1
nvm use                      # Node 24, from .nvmrc
npm ci
npm run build                # also builds dist/primal-angular
npm login                    # as myceliumllc
for p in packages/tokens packages/css packages/contracts dist/primal-angular; do
  (cd "$p" && npm publish --access public)
done
```

This first version has no provenance, since it isn't published from CI. Every later version has it.

## Once: each package's trusted publisher

For each of the four packages, on npmjs.com open the package's **Settings** page (`https://www.npmjs.com/package/@mycelium-llc/<package>/access`), find **Trusted Publisher**, choose **GitHub Actions**, and enter:

| Field | Value |
|---|---|
| Organization or user | `Mycelium-LLC` |
| Repository | `primal-ui` |
| Workflow filename | `publish.yml` |
| Environment name | leave empty |

The packages: `@mycelium-llc/primal-tokens`, `@mycelium-llc/primal-css`, `@mycelium-llc/primal-contracts`, `@mycelium-llc/primal-angular`.

Then, on the same page under **Publishing access**, choose **Require two-factor authentication and disallow tokens**: from then on only the workflow, or a person with two-factor authentication, can publish. npm says a new trusted publisher must complete a publish within two days, or it has to be set again.

## Every release after that

Push the tag `x.y.z` on main's merge commit (the release chain does). `.github/workflows/publish.yml` checks that the tag is the packages' version, runs the checks, builds, and publishes each package that isn't at that version yet, with provenance. It needs npm 11.5.1 or later, which it installs. A package not on npm yet is skipped with a notice, and a version already there is skipped, so a run can be repeated safely from Actions → Publish → Run workflow, on the tag.
