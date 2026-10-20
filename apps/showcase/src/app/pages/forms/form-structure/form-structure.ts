import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PagePlaceholder } from '../../../shell/page-placeholder/page-placeholder';

/** Placeholder until 0.3.0: the plain native elements this page will cover (decision 10). */
@Component({
  selector: 'pr-forms-form-structure-page',
  imports: [PagePlaceholder],
  templateUrl: './form-structure.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormsFormStructurePage {}
