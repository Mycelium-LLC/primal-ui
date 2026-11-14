import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PRIMAL_TABLES } from '@mycelium-llc/primal-angular';
import { CoverageTable } from '../../../shell/coverage-table/coverage-table';

@Component({
  selector: 'pr-native-text-page',
  imports: [PRIMAL_TABLES, CoverageTable],
  templateUrl: './text.html',
  styleUrl: './text.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NativeTextPage {}
