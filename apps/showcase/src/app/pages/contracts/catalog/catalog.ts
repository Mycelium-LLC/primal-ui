import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PagePlaceholder } from '../../../shell/page-placeholder/page-placeholder';

/** Placeholder until 0.9.0: the plain native elements this page will cover (decision 10). */
@Component({
  selector: 'pr-contracts-catalog-page',
  imports: [PagePlaceholder],
  templateUrl: './catalog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContractsCatalogPage {}
