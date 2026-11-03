import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PRIMAL_TABLES } from 'primal-angular';
import { RouterLink } from '@angular/router';
import { NAV } from '../../shell/nav';

@Component({
  selector: 'pr-overview-page',
  imports: [PRIMAL_TABLES, RouterLink],
  templateUrl: './overview.html',
  styleUrl: './overview.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewPage {
  protected readonly sections = NAV;
}
