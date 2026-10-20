import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PagePlaceholder } from '../../../shell/page-placeholder/page-placeholder';

/** Placeholder until 0.1.0: the plain native elements this page will cover (decision 10). */
@Component({
  selector: 'pr-foundation-typography-page',
  imports: [PagePlaceholder],
  templateUrl: './typography.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FoundationTypographyPage {}
