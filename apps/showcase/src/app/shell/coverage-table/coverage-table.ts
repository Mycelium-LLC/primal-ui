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

export interface CoverageRow extends Omit<Coverage, 'element'> {
  elements: string[];
}

export function mergeRows(rows: Coverage[]): CoverageRow[] {
  const out: CoverageRow[] = [];
  for (const { element, ...rest } of rows) {
    const last = out[out.length - 1];
    if (last && last.outcome === rest.outcome && last.where === rest.where && last.reason === rest.reason) last.elements.push(element);
    else out.push({ ...rest, elements: [element] });
  }
  return out;
}

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
          @for (row of rows(); track row.elements[0]) {
            <tr>
              <th scope="row">
                @for (el of row.elements; track el) {
                  <code>{{ el }}</code>{{ $last ? '' : ' ' }}
                }
              </th>
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
      table-layout: fixed;
      min-inline-size: 36rem;
      font-size: var(--pr-text-small);
    }

    /* Fixed columns, so every table in the list lines up with the next. */
    th:nth-child(1) {
      inline-size: 26%;
    }

    th:nth-child(2) {
      inline-size: 18%;
    }

    th:nth-child(3) {
      inline-size: 9%;
    }

    tbody th {
      font-weight: var(--pr-weight-regular);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoverageTable {
  /** The elements to list, as a space-separated string, in the order given. */
  readonly elements = input.required<string>();
  readonly caption = input('What these elements get');
  protected readonly label = OUTCOME_LABEL;
  /** Elements next to each other with the same outcome and reason share one row. */
  protected readonly rows = computed(() => mergeRows(
    this.elements()
      .split(/\s+/)
      .map((name) => COVERAGE.find((r) => r.element === name))
      .filter((r): r is Coverage => !!r),
  ));
}
