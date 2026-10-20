import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PagePlaceholder } from '../../../shell/page-placeholder/page-placeholder';

/** Placeholder until 0.7.0: the plain native elements this page will cover (decision 10). */
@Component({
  selector: 'pr-content-cells-page',
  imports: [PagePlaceholder],
  templateUrl: './cells.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentCellsPage {}
