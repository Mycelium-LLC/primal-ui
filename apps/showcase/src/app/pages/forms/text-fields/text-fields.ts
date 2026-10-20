import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PagePlaceholder } from '../../../shell/page-placeholder/page-placeholder';

/** Placeholder until 0.3.0: the plain native elements this page will cover (decision 10). */
@Component({
  selector: 'pr-forms-text-fields-page',
  imports: [PagePlaceholder],
  templateUrl: './text-fields.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormsTextFieldsPage {}
