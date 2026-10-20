import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PagePlaceholder } from '../../../shell/page-placeholder/page-placeholder';

/** Placeholder until 0.5.0: the plain native elements this page will cover (decision 10). */
@Component({
  selector: 'pr-navigation-focus-and-keys-page',
  imports: [PagePlaceholder],
  templateUrl: './focus-and-keys.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationFocusAndKeysPage {}
