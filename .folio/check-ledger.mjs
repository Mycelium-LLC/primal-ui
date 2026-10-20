#!/usr/bin/env node
/**
 * Check Primal's Folio ledger (adapted from Mycelium-Meeny .folio/check-ledger.mjs) against the PRD it folds over.
 *
 *   node .folio/check-ledger.mjs                 exit 1 on any problem
 *   node .folio/check-ledger.mjs --fold 1.7.0    print the requirement set at a release
 *   node .folio/check-ledger.mjs --coverage      list baseline requirements no release touches
 *
 * The ledger (.folio/ledger.json) is the authored truth for what each release adds,
 * rewords or retires; the PRD at release N is the fold of the baseline
 * (.folio/prd.json) plus every release up to N. This is the loader's contract,
 * run before anything is written to the Vault:
 *
 *   - addresses are Folio's full `primal/<feature>/<requirement>`;
 *   - every `change`, `retire` and `makesTrue` names a requirement that exists in the fold at that release;
 *   - every `add` is new, its feature exists by then, and it carries kind, statement, success,
 *     disqualifier and evidence (the PRD's own shape);
 *   - a requirement is never added and changed in the same release (Folio refuses a zero-width range);
 *   - a `change` states `previously` exactly as the fold holds it;
 *   - versions are unique and ascending, and `dependsOn` names an EARLIER release;
 *   - `awaitingNiko` entries match the final fold, and are never applied by it.
 *
 * No dependencies. Reads only.
 */

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const ledger = JSON.parse(readFileSync(join(root, '.folio/ledger.json'), 'utf8'));
const prd = JSON.parse(readFileSync(join(root, ledger.baseline.source), 'utf8'));
const prefix = ledger.folioPrefix;

const kebab = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const cmp = (a, b) => {
  const pa = a.split('.').map(Number);
  const pb = b.split('.').map(Number);
  for (let i = 0; i < 3; i++) if (pa[i] !== pb[i]) return pa[i] - pb[i];
  return 0;
};

const reqs = new Map();
const features = new Set();
const baseline = new Set();
for (const domain of prd.domains) {
  for (const feature of domain.features) {
    const fs = feature.slug || kebab(feature.name);
    features.add(fs);
    for (const r of feature.requirements) {
      const address = `${prefix}/${fs}/${r.slug}`;
      reqs.set(address, r.statement);
      baseline.add(address);
    }
  }
}

const args = process.argv.slice(2);
const foldAt = args.includes('--fold') ? args[args.indexOf('--fold') + 1] : null;
const coverage = args.includes('--coverage');

const problems = [];
const seen = [];
const touched = new Set();
let printed = false;

for (const release of ledger.releases) {
  const v = release.version;
  const where = (msg) => problems.push(`${v}: ${msg}`);

  if (seen.includes(v)) where('duplicate version');
  if (seen.length && cmp(v, seen[seen.length - 1]) <= 0) where('versions are not ascending');
  for (const dep of release.dependsOn ?? []) {
    if (!seen.includes(dep)) where(`dependsOn ${dep}, which is not an earlier release`);
  }
  if (!['release', 'slice'].includes(release.kind)) where(`kind must be release or slice`);
  for (const field of ['name', 'goal', 'usersSee', 'rollout', 'doneWhen']) {
    if (!release[field]) where(`missing ${field}`);
  }

  const addedHere = new Set();
  for (const m of release.mutations ?? []) {
    if (m.kind === 'feature') {
      if (features.has(m.address)) where(`feature ${m.address} already exists`);
      features.add(m.address);
      continue;
    }
    if (m.kind !== 'requirement') { where(`unknown kind ${m.kind}`); continue; }
    if (!m.address.startsWith(`${prefix}/`)) where(`${m.address} is not a full ${prefix}/ address`);
    const feature = m.address.split('/')[1];
    touched.add(m.address);
    if (m.op === 'add') {
      if (reqs.has(m.address)) where(`add: ${m.address} already exists`);
      if (!features.has(feature)) where(`add: feature ${feature} does not exist by this release`);
      for (const field of ['requirementKind', 'statement', 'success', 'disqualifier', 'evidence']) {
        if (!m[field]) where(`add: ${m.address} has no ${field}`);
      }
      reqs.set(m.address, m.statement);
      addedHere.add(m.address);
    } else if (m.op === 'change') {
      if (!reqs.has(m.address)) where(`change: ${m.address} does not exist`);
      else if (reqs.get(m.address) !== m.previously) where(`change: ${m.address} "previously" does not match the fold`);
      if (addedHere.has(m.address)) where(`change: ${m.address} is added and changed in the same release`);
      if (!m.statement || !m.why) where(`change: ${m.address} needs statement and why`);
      reqs.set(m.address, m.statement);
    } else if (m.op === 'retire') {
      if (!reqs.has(m.address)) where(`retire: ${m.address} does not exist`);
      reqs.delete(m.address);
    } else {
      where(`unknown op ${m.op}`);
    }
  }
  for (const address of release.makesTrue ?? []) {
    touched.add(address);
    if (!reqs.has(address)) where(`makesTrue: ${address} does not exist at this release`);
  }
  seen.push(v);

  if (foldAt === v) {
    for (const [address, statement] of [...reqs].sort()) console.log(`${address}\n  ${statement}`);
    printed = true;
  }
}

for (const m of ledger.awaitingNiko ?? []) {
  touched.add(m.address);
  if (!reqs.has(m.address)) problems.push(`awaitingNiko: ${m.address} does not exist in the final fold`);
  else if (reqs.get(m.address) !== m.previously) problems.push(`awaitingNiko: ${m.address} "previously" does not match the final fold`);
}
for (const address of ledger.verifyAtBaseline ?? []) {
  touched.add(address);
  if (!baseline.has(address)) problems.push(`verifyAtBaseline: ${address} is not a baseline requirement`);
}

// Item state: absent means open. Done or partial carries its evidence in the text,
// because the text is what Folio shows («*Done in 1.3.30: …*», «*Partial: … Missing: …*»).
for (const release of ledger.releases) {
  release.items.forEach((item, i) => {
    const where = (msg) => problems.push(`${release.version} item ${i + 1}: ${msg}`);
    if (item.state === undefined || item.state === 'open') return;
    if (item.state === 'done' && !/\*Done[ :]/.test(item.text)) where('done, but the text carries no «*Done …*» evidence');
    else if (item.state === 'partial' && !/\*Partial[ :][\s\S]*Missing/.test(item.text)) where('partial, but the text does not say «*Partial: … Missing: …*»');
    else if (!['done', 'partial'].includes(item.state)) where(`state must be done, partial or open, not ${item.state}`);
  });
}

// Shipped history: git releases in ascending order, each naming the milestone items it delivered.
const milestones = new Map(ledger.releases.map((r) => [r.version, r]));
let prevShipped = null;
for (const s of ledger.shipped ?? []) {
  const where = (msg) => problems.push(`shipped ${s.version}: ${msg}`);
  if (prevShipped && cmp(s.version, prevShipped) <= 0) where('versions are not ascending');
  prevShipped = s.version;
  if (!s.delivered) where('missing delivered');
  for (const d of s.delivers ?? []) {
    const m = milestones.get(d.milestone);
    if (!m) { where(`delivers items of ${d.milestone}, which is not a ledger release`); continue; }
    for (const n of d.items ?? []) {
      const item = m.items[n - 1];
      if (!item) where(`${d.milestone} has no item ${n}`);
      else if (!['done', 'partial'].includes(item.state)) where(`${d.milestone} item ${n} is delivered here but its state is ${item.state ?? 'open'}`);
    }
  }
}
if (ledger.today && ledger.shipped?.length && ledger.today.version !== ledger.shipped[ledger.shipped.length - 1].version) {
  problems.push(`today is ${ledger.today.version}, but the last shipped release is ${ledger.shipped[ledger.shipped.length - 1].version}`);
}

if (foldAt && !printed) problems.push(`--fold: no release ${foldAt}`);

if (problems.length) {
  console.error(`✖ ${problems.length} problem(s) in .folio/ledger.json`);
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}

const untouched = [...baseline].filter((a) => !touched.has(a)).sort();
if (coverage) {
  for (const a of untouched) console.log(a);
} else if (!foldAt) {
  const last = ledger.releases[ledger.releases.length - 1]?.version;
  console.log(
    `✔ ledger ok: ${ledger.releases.length} releases, ${reqs.size} requirements at ${last}; ` +
    `${baseline.size - untouched.length} of ${baseline.size} baseline requirements placed ` +
    `(the rest are listed under notPlanned by feature; --coverage lists them)`,
  );
}
