import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PagePlaceholder } from '../../../shell/page-placeholder/page-placeholder';

/** Placeholder until 0.2.0: the plain native elements this page will cover (decision 10). */
@Component({
  selector: 'pr-native-media-page',
  imports: [PagePlaceholder],
  templateUrl: './media.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NativeMediaPage {}
