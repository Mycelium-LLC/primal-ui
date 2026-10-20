import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import coverage from '../../../../../../packages/css/coverage.json';

export interface Coverage {
  element: string;
  group: string;
  outcome: 'styled' | 'enhanced' | 'native' | 'excluded';
  where: string;
  reason: string;
}

export const COVERAGE = coverage.elements as Coverage[];

export const OUTCOME_LABEL: Record<Coverage['outcome'], string> = {
  styled: 'Styled',
  enhanced: 'Enhanced by a component',
  native: 'Left native',
  excluded: 'Excluded',
};

/** The coverage inventory for some elements: each one's outcome and why. */
@Component({
  selector: 'pr-coverage-table',
  template: `
    <div class="pr-table" role="region" [attr.aria-label]="caption()" tabindex="0">
      <table>
        <caption>{{ caption() }}</caption>
        <thead>
          <tr>
            <th scope="col">Element</th>
            <th scope="col">Outcome</th>
            <th scope="col">Release</th>
            <th scope="col">Why</th>
          </tr>
        </thead>
        <tbody>
          @for (row of rows(); track row.element) {
            <tr>
              <th scope="row"><code>{{ row.element }}</code></th>
              <td>{{ label[row.outcome] }}</td>
              <td>{{ row.where === 'none' ? '' : row.where }}</td>
              <td>{{ row.reason }}</td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
  styles: `
    table {
      font-size: var(--pr-text-small);
    }

    tbody th {
      font-weight: var(--pr-weight-regular);
      white-space: nowrap;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoverageTable {
  /** The elements to list, as a space-separated string, in the order given. */
  readonly elements = input.required<string>();
  readonly caption = input('What these elements get');
  protected readonly label = OUTCOME_LABEL;
  protected readonly rows = computed(() =>
    this.elements()
      .split(/\s+/)
      .map((name) => COVERAGE.find((r) => r.element === name))
      .filter((r): r is Coverage => !!r),
  );
}
