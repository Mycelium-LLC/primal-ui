import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PagePlaceholder } from '../../../shell/page-placeholder/page-placeholder';

/** Placeholder until 0.7.0: the plain native elements this page will cover (decision 10). */
@Component({
  selector: 'pr-content-layout-page',
  imports: [PagePlaceholder],
  templateUrl: './layout.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentLayoutPage {}
