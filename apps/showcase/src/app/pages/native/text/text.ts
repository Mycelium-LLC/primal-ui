import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CoverageTable } from '../../../shell/coverage-table/coverage-table';

@Component({
  selector: 'pr-native-text-page',
  imports: [CoverageTable],
  templateUrl: './text.html',
  styleUrl: './text.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NativeTextPage {}
