import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CoverageTable } from '../../../shell/coverage-table/coverage-table';

/* MOCK DATA: a month of build times, to show a long numeric table. */
const BUILDS = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  builds: 3 + ((i * 7) % 9),
  seconds: +(28 + ((i * 13) % 17) + ((i * 3) % 10) / 10).toFixed(1),
  failed: (i * 5) % 7 === 0 ? 1 : 0,
}));

@Component({
  selector: 'pr-native-tables-page',
  imports: [CoverageTable],
  templateUrl: './tables.html',
  styleUrl: './tables.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NativeTablesPage {
  protected readonly builds = BUILDS;
  protected readonly total = BUILDS.reduce((n, b) => n + b.builds, 0);
}
