import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PRIMAL_CELLS, PRIMAL_CONTENT, PrimalSearchResult } from '@mycelium-llc/primal-angular';
import { NAV } from '../../../shell/nav';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// The showcase's own pages, searched (mock search: no server).
const PAGES: PrimalSearchResult[] = NAV.flatMap((s) =>
  s.pages.map((p) => ({ title: p.title, href: p.path, meta: s.title, snippet: `${s.title} › ${p.title}, built in ${p.release}.` })),
);

@Component({
  selector: 'pr-content-cells-page',
  imports: [PRIMAL_CELLS, PRIMAL_CONTENT],
  templateUrl: './cells.html',
  styleUrl: '../../actions/actions-pages.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentCellsPage {
  // Pretend subscription: bounce@… fails the way a real list provider would (mock).
  protected readonly subscribe = async (email: string) => {
    await wait(700);
    if (email.startsWith('bounce@')) throw new Error('That address bounced last time. Check it, or use another.');
  };

  protected readonly popular = PAGES.filter((p) => ['Colour', 'Text fields', 'Actions', 'Tables'].includes(p.title));

  protected readonly searchDocs = async (q: string) => {
    await wait(600);
    if (q.toLowerCase() === 'break') throw new Error('down');
    const term = q.toLowerCase();
    return PAGES.filter((p) => p.title.toLowerCase().includes(term) || p.snippet!.toLowerCase().includes(term));
  };

  // Sample issues at real length (mock data).
  protected readonly issues = [
    { n: 214, title: 'Exported CSV drops the last row when the report has more than 10,000 lines', state: 'negative', stateLabel: 'Bug', labels: ['Export', 'P1'], assignee: 'Ada Shapiro' },
    { n: 219, title: 'Let owners transfer a workspace', state: 'progress', stateLabel: 'In progress', labels: ['Workspaces'], assignee: 'Noa Levi' },
    { n: 221, title: 'Dark mode for printed invoices', state: 'neutral', stateLabel: 'Not started', labels: ['Invoices', 'Design'], assignee: 'Sam Okafor' },
  ];
}
