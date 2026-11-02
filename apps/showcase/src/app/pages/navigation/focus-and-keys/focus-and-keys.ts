import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PRIMAL_ACTIONS, PRIMAL_KEYS, PRIMAL_NAVIGATION, PRIMAL_TABLES, PRIMAL_TOP_LAYERS } from 'primal-angular';

/** The keys, read from the same words the library exports. */
@Component({
  selector: 'pr-navigation-focus-and-keys-page',
  imports: [PRIMAL_ACTIONS, PRIMAL_NAVIGATION, PRIMAL_TOP_LAYERS, PRIMAL_TABLES, RouterLink],
  templateUrl: './focus-and-keys.html',
  styleUrl: '../../actions/actions-pages.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationFocusAndKeysPage {
  protected readonly keys = PRIMAL_KEYS;
}
