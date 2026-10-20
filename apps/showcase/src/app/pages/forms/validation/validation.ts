import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PagePlaceholder } from '../../../shell/page-placeholder/page-placeholder';

/** Placeholder until 0.3.0: the plain native elements this page will cover (decision 10). */
@Component({
  selector: 'pr-forms-validation-page',
  imports: [PagePlaceholder],
  templateUrl: './validation.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormsValidationPage {}
