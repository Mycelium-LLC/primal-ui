/*
 * MOCK DATA. Everything Field Notes shows starts here and lives in memory only: nothing is sent
 * anywhere, and a reload starts over. Replace it with your own data source.
 */

export type ProjectStatus = 'active' | 'paused' | 'done';

export interface Note {
  readonly id: number;
  readonly text: string;
  readonly author: string;
  /** ISO date, so it sorts and reads with <time datetime>. */
  readonly written: string;
}

export interface Project {
  readonly slug: string;
  readonly name: string;
  readonly owner: string;
  readonly status: ProjectStatus;
  readonly summary: string;
  readonly updated: string;
  readonly notes: readonly Note[];
}

export interface Team {
  readonly slug: string;
  readonly name: string;
  readonly purpose: string;
  readonly members: readonly string[];
}

export interface Person {
  readonly name: string;
  readonly email: string;
}

/** MOCK DATA: the people a project can belong to. */
export const PEOPLE: readonly Person[] = [
  { name: 'Ada Shapiro', email: 'ada@example.com' },
  { name: 'Ben Okafor', email: 'ben@example.com' },
  { name: 'Carmen Ruiz', email: 'carmen@example.com' },
  { name: 'Dov Levi', email: 'dov@example.com' },
];

/** MOCK DATA: the projects the team starts with. */
export const PROJECTS: readonly Project[] = [
  {
    slug: 'river-survey',
    name: 'River survey',
    owner: 'Ada Shapiro',
    status: 'active',
    summary: 'Water samples from six points along the Yarkon, every second week.',
    updated: '2026-10-29',
    notes: [
      { id: 1, text: 'Point 4 was dry again. Moved the sample 30 metres downstream.', author: 'Ada Shapiro', written: '2026-10-29' },
      { id: 2, text: 'New bottles arrived; the old batch goes back to the lab.', author: 'Ben Okafor', written: '2026-10-21' },
    ],
  },
  {
    slug: 'bird-count',
    name: 'Bird count',
    owner: 'Carmen Ruiz',
    status: 'paused',
    summary: 'The winter count in the park, paused until the migration starts.',
    updated: '2026-09-14',
    notes: [{ id: 3, text: 'Paused until mid-November. Counting sheets are in the shared drawer.', author: 'Carmen Ruiz', written: '2026-09-14' }],
  },
  {
    slug: 'soil-log',
    name: 'Soil log',
    owner: 'Dov Levi',
    status: 'done',
    summary: 'A year of soil moisture readings in the community garden.',
    updated: '2026-06-30',
    notes: [],
  },
  {
    slug: 'night-sky',
    name: 'Night sky',
    owner: 'Ben Okafor',
    status: 'active',
    summary: 'Light pollution readings from the roof, once a month at new moon.',
    updated: '2026-11-01',
    notes: [
      { id: 4, text: 'Clouds most of the night; two readings only.', author: 'Ben Okafor', written: '2026-11-01' },
      { id: 5, text: 'The meter needs a new battery before December.', author: 'Dov Levi', written: '2026-10-05' },
      { id: 6, text: 'Readings are up 8% on last year at the same phase.', author: 'Ada Shapiro', written: '2026-10-04' },
    ],
  },
];

/** MOCK DATA: the teams the workspace starts with. */
export const TEAMS: readonly Team[] = [
  { slug: 'water', name: 'Water', purpose: 'Everything that flows: the river, the wells, the rain gauge.', members: ['ada@example.com', 'ben@example.com'] },
];

export const STATUS_LABEL: Record<ProjectStatus, string> = { active: 'Active', paused: 'Paused', done: 'Done' };
export const STATUS_STATE: Record<ProjectStatus, string> = { active: 'positive', paused: 'warning', done: 'neutral' };

/** "River survey" becomes "river-survey": a readable address. */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '');
}

/** Today, as an ISO date. */
export function today(): string {
  return new Date().toISOString().slice(0, 10);
}
