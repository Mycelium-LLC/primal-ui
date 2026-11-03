import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { PRIMAL_ACTIONS, PRIMAL_CONTENT, PRIMAL_FORMS } from '@mycelium-llc/primal-angular';

@Component({
  selector: 'pr-content-information-page',
  imports: [PRIMAL_CONTENT, PRIMAL_ACTIONS, PRIMAL_FORMS],
  templateUrl: './information.html',
  styleUrl: '../../actions/actions-pages.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentInformationPage {
  /** The strip test for colour: everything above should still read in grey. */
  protected readonly grey = signal(false);
}
