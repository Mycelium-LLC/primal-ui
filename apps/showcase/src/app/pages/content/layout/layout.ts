import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { PRIMAL_ACTIONS, PRIMAL_CONTENT, PRIMAL_FORMS } from '@mycelium-llc/primal-angular';

@Component({
  selector: 'pr-content-layout-page',
  imports: [PRIMAL_CONTENT, PRIMAL_ACTIONS, PRIMAL_FORMS],
  templateUrl: './layout.html',
  styleUrl: '../../actions/actions-pages.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentLayoutPage {
  /** The strip test: with the frames gone, the grouping should still read. */
  protected readonly stripped = signal(false);
  protected readonly bold = signal(false);
  protected readonly italic = signal(false);

  // Sample metrics and activity (mock data).
  protected readonly metrics = [
    { label: 'Revenue', value: '$136,100' },
    { label: 'Customers', value: '1,284' },
    { label: 'Churn', value: '2.1%' },
    { label: 'Open invoices', value: '17' },
  ];
  protected readonly activity = Array.from({ length: 14 }, (_, i) => `Invoice INV-${2040 + i} paid by Acme Studio`);
}
