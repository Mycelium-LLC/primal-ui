import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PagePlaceholder } from '../../../shell/page-placeholder/page-placeholder';

/** Placeholder until 0.7.0: the plain native elements this page will cover (decision 10). */
@Component({
  selector: 'pr-surfaces-app-shell-page',
  imports: [PagePlaceholder],
  templateUrl: './app-shell.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SurfacesAppShellPage {}
