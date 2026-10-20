import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PagePlaceholder } from '../../shell/page-placeholder/page-placeholder';

/** Placeholder until 1.0.0: the plain native elements this page will cover (decision 10). */
@Component({
  selector: 'pr-start-page',
  imports: [PagePlaceholder],
  templateUrl: './start.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StartPage {}
