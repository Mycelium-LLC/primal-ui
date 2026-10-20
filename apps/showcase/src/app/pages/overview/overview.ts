import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NAV } from '../../shell/nav';

@Component({
  selector: 'pr-overview-page',
  imports: [RouterLink],
  templateUrl: './overview.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewPage {
  protected readonly sections = NAV;
}
