import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CoverageTable } from '../../../shell/coverage-table/coverage-table';

@Component({
  selector: 'pr-native-quotes-and-code-page',
  imports: [CoverageTable],
  templateUrl: './quotes-and-code.html',
  styleUrl: './quotes-and-code.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NativeQuotesAndCodePage {
  protected readonly snippet = `:root {
  --pr-black: oklch(22% 0.01 255);
  --pr-white: oklch(99.5% 0 0);
  --pr-primary: oklch(50% 0.17 255);
}`;
}
