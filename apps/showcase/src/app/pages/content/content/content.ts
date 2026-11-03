import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PRIMAL_CONTENT, PRIMAL_TABLES } from '@mycelium-llc/primal-angular';

// Sample reports and people (mock data), at real length.
const REPORTS = [
  { title: 'Q3 revenue by plan and region, with refunds', summary: 'Revenue rose 12% over Q2, led by the Team plan in Europe.', state: 'positive', stateLabel: 'Published', updated: '2 hours ago' },
  { title: 'Churn by plan', summary: 'Who left, when, and the last thing they did before they went.', state: 'progress', stateLabel: 'Draft', updated: 'yesterday' },
  { title: 'Weekly signups', summary: 'New accounts by source, every Monday.', state: 'warning', stateLabel: 'Stale', updated: '9 days ago' },
];

const PEOPLE = [
  { name: 'Ada Shapiro', email: 'ada.shapiro@example.com', state: 'positive', stateLabel: 'Active' },
  { name: 'Noa Levi-Montalcini', email: 'noa.levi-montalcini@example.com', state: 'neutral', stateLabel: 'Invited' },
  { name: 'Sam Okafor', email: 'sam@example.com', state: 'negative', stateLabel: 'Suspended' },
];

@Component({
  selector: 'pr-content-content-page',
  imports: [PRIMAL_CONTENT, PRIMAL_TABLES, RouterLink],
  templateUrl: './content.html',
  styleUrl: '../../actions/actions-pages.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentContentPage {
  protected readonly reports = REPORTS;
  protected readonly people = PEOPLE;

  protected readonly snippet = `<ul class="pr-cards">
  <li class="pr-card">
    <h3 class="pr-card-title"><a href="/reports/q3">Q3 revenue</a></h3>
    <p>Revenue rose 12% over Q2.</p>
    <p class="pr-card-meta">
      <span class="pr-status" data-state="positive">Published</span>
      <span data-gives-way>Updated 2 hours ago</span>
    </p>
  </li>
</ul>`;
}
