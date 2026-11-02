import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { PRIMAL_ACTIONS, PRIMAL_CONTENT, PRIMAL_NAVIGATION } from 'primal-angular';

// MOCK DATA: the places of a sample product, and what each holds.
const PLACES = [
  { label: 'Reports', icon: 'M5 20V10M12 20V4M19 20v-7', count: 0, text: 'Every report in Acme Studio, newest first.' },
  { label: 'Invoices', icon: 'M7 3h10v18l-5-3-5 3zM10 8h4M10 12h4', count: 3, text: 'Three invoices are waiting for your approval.' },
  { label: 'Customers', icon: 'M16 19v-1a4 4 0 0 0-8 0v1M12 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6z', count: 0, text: '1,284 customers, by last activity.' },
  { label: 'Settings', icon: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM4 12h2M18 12h2M12 4v2M12 18v2', count: 0, text: 'Your workspace, your team and your plan.' },
];

/** The app shell surface, shown twice: at a desk's width and at a phone's, the same shell laid out by its own width. */
@Component({
  selector: 'pr-surfaces-app-shell-page',
  imports: [PRIMAL_ACTIONS, PRIMAL_CONTENT, PRIMAL_NAVIGATION],
  templateUrl: './app-shell.html',
  styleUrls: ['../surfaces.css', '../../actions/actions-pages.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SurfacesAppShellPage {
  protected readonly frames = ['Desk', 'Phone'];
  protected readonly places = PLACES;
  protected readonly here = signal('Invoices');
  protected readonly placeText = computed(() => PLACES.find((p) => p.label === this.here())?.text ?? '');
  protected readonly menuOpen = signal<Record<string, boolean>>({});

  protected toggle(frame: string): void {
    this.menuOpen.update((m) => ({ ...m, [frame]: !m[frame] }));
  }

  /** Choosing a place moves there, and on a phone closes the menu so the place shows. */
  protected go(frame: string, place: string): void {
    this.here.set(place);
    this.menuOpen.update((m) => ({ ...m, [frame]: false }));
  }
}
