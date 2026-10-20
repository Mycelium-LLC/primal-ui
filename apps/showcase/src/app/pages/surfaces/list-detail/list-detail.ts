import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PagePlaceholder } from '../../../shell/page-placeholder/page-placeholder';

/** Placeholder until 0.8.0: the plain native elements this page will cover (decision 10). */
@Component({
  selector: 'pr-surfaces-list-detail-page',
  imports: [PagePlaceholder],
  templateUrl: './list-detail.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SurfacesListDetailPage {}
