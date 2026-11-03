# @mycelium-llc/primal-contracts

**TL;DR:** Every Mycelium Primal component's contract as framework-independent JSON (what it promises, its states, keys, accessibility and the markup to copy), the schema, and `primal-contracts-check` to keep your own contracts as complete.

```bash
npx @mycelium-llc/primal-contracts primal-contracts-check contracts/
```

Or install it and run `npx primal-contracts-check contracts/`. The folder must hold contracts only: every `.json` in it is read as one, named for its `id`. `contracts.json` holds all of Primal's, and `schema.json` the shape. Browse them in the [contract catalog](https://primal.myceliumllc.dev/showcase/contracts/catalog).

Part of [Mycelium Primal](https://primal.myceliumllc.dev) · MIT
