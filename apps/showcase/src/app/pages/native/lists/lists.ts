import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CoverageTable } from '../../../shell/coverage-table/coverage-table';

@Component({
  selector: 'pr-native-lists-page',
  imports: [CoverageTable],
  templateUrl: './lists.html',
  styleUrl: './lists.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NativeListsPage {}
