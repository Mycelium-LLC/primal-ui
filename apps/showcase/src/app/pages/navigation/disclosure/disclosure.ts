import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PagePlaceholder } from '../../../shell/page-placeholder/page-placeholder';

/** Placeholder until 0.6.0: the plain native elements this page will cover (decision 10). */
@Component({
  selector: 'pr-navigation-disclosure-page',
  imports: [PagePlaceholder],
  templateUrl: './disclosure.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationDisclosurePage {}
