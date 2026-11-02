import { Injectable, computed, signal } from '@angular/core';

export interface Report {
  readonly slug: string;
  readonly name: string;
  readonly summary: string;
  readonly owner: string;
  readonly state: 'positive' | 'progress' | 'warning';
  readonly stateLabel: string;
  readonly updated: string;
}

/** "Q3 revenue by plan" → "q3-revenue-by-plan": readable, never a bare id. */
export const slugify = (name: string) =>
  name
    .toLocaleLowerCase()
    .normalize('NFKD')
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-|-$/g, '') || 'report';

// MOCK DATA: the reports the reference surfaces work on. Held in memory for the session; nothing is saved anywhere.
const SEED: Report[] = [
  { slug: 'q3-revenue-by-plan', name: 'Q3 revenue by plan', summary: 'Revenue rose 12% over Q2, led by the Team plan in Europe.', owner: 'Ada Shapiro', state: 'positive', stateLabel: 'Published', updated: '2 hours ago' },
  { slug: 'churn-by-plan', name: 'Churn by plan', summary: 'Who left, when, and the last thing they did before they went.', owner: 'Noa Levi', state: 'progress', stateLabel: 'Draft', updated: 'yesterday' },
  { slug: 'weekly-signups', name: 'Weekly signups', summary: 'New accounts by source, every Monday.', owner: 'Sam Okafor', state: 'warning', stateLabel: 'Stale', updated: '9 days ago' },
  { slug: 'invoices-overdue-by-customer', name: 'Invoices overdue by customer, oldest first', summary: 'Every unpaid invoice past its due date, with who to call.', owner: 'Ada Shapiro', state: 'positive', stateLabel: 'Published', updated: 'this morning' },
];

/** The reports, for the list-with-detail surface (mock store). */
@Injectable({ providedIn: 'root' })
export class Reports {
  readonly all = signal<Report[]>(SEED);
  readonly count = computed(() => this.all().length);

  find(slug: string): Report | undefined {
    return this.all().find((r) => r.slug === slug);
  }

  /** A new report with a slug no other report has. */
  create(name: string): Report {
    const base = slugify(name);
    let slug = base;
    for (let n = 2; this.find(slug); n++) slug = `${base}-${n}`;
    const report: Report = { slug, name, summary: 'No summary yet.', owner: 'You', state: 'progress', stateLabel: 'Draft', updated: 'just now' };
    this.all.update((list) => [report, ...list]);
    return report;
  }

  rename(slug: string, name: string): void {
    this.all.update((list) => list.map((r) => (r.slug === slug ? { ...r, name, updated: 'just now' } : r)));
  }

  /** Removes it, and hands back a way to put it back where it was. */
  remove(slug: string): () => void {
    const before = this.all();
    this.all.update((list) => list.filter((r) => r.slug !== slug));
    return () => this.all.set(before);
  }
}
