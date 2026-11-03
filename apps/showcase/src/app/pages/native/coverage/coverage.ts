import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { PRIMAL_TABLES } from '@mycelium-llc/primal-angular';
import { COVERAGE, Coverage, OUTCOME_LABEL, mergeRows } from '../../../shell/coverage-table/coverage-table';

type Filter = Coverage['outcome'] | 'all';

@Component({
  selector: 'pr-native-coverage-page',
  imports: [PRIMAL_TABLES],
  templateUrl: './coverage.html',
  styleUrl: './coverage.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NativeCoveragePage {
  protected readonly label = OUTCOME_LABEL;
  protected readonly filter = signal<Filter>('all');
  protected readonly filters: { key: Filter; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: COVERAGE.length },
    ...(Object.keys(OUTCOME_LABEL) as Coverage['outcome'][]).map((key) => ({
      key,
      label: OUTCOME_LABEL[key],
      count: COVERAGE.filter((r) => r.outcome === key).length,
    })),
  ];
  protected readonly groups = computed(() => {
    const rows = COVERAGE.filter((r) => this.filter() === 'all' || r.outcome === this.filter());
    return [...new Set(rows.map((r) => r.group))].map((group) => ({ group, rows: mergeRows(rows.filter((r) => r.group === group)) }));
  });
}
