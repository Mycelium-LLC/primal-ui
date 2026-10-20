import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PagePlaceholder } from '../../../shell/page-placeholder/page-placeholder';

/** Placeholder until 0.2.0: the plain native elements this page will cover (decision 10). */
@Component({
  selector: 'pr-native-quotes-and-code-page',
  imports: [PagePlaceholder],
  templateUrl: './quotes-and-code.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NativeQuotesAndCodePage {}
