import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { PRIMAL_ACTIONS, PRIMAL_CONTENT, PRIMAL_NAVIGATION } from '@mycelium-llc/primal-angular';
import { Auth } from '../auth/auth';

/** The product's places, in the order they keep forever. */
const PLACES = [
  { path: '/projects', label: 'Projects', icon: 'M4 6h16M4 12h16M4 18h10' },
  { path: '/teams', label: 'Teams', icon: 'M16 19v-1a4 4 0 0 0-8 0v1M12 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM20 19v-1a3 3 0 0 0-2-2.8M4 19v-1a3 3 0 0 1 2-2.8' },
  { path: '/settings', label: 'Settings', icon: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM4 12h2M18 12h2M12 4v2M12 18v2M6.3 6.3l1.4 1.4M16.3 16.3l1.4 1.4M6.3 17.7l1.4-1.4M16.3 7.7l1.4-1.4' },
];

/** The frame every signed-in place sits in: Primal's app shell, the bar and the places holding still. */
@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, PRIMAL_ACTIONS, PRIMAL_CONTENT, PRIMAL_NAVIGATION],
  templateUrl: './shell.html',
  styleUrl: './shell.css',
})
export class Shell {
  protected readonly auth = inject(Auth);
  private readonly router = inject(Router);
  protected readonly places = PLACES;

  protected signOut(): void {
    this.auth.signOut();
    void this.router.navigateByUrl('/sign-in');
  }
}
