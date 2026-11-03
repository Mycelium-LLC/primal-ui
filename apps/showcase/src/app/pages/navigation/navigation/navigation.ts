import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PRIMAL_ACTIONS, PRIMAL_FORMS, PRIMAL_NAVIGATION, PRIMAL_TABLES } from '@mycelium-llc/primal-angular';
import { PlainHtml } from '../../../shell/plain-html/plain-html';

@Component({
  selector: 'pr-navigation-navigation-page',
  imports: [PRIMAL_NAVIGATION, PRIMAL_ACTIONS, PRIMAL_FORMS, PRIMAL_TABLES, PlainHtml, RouterLink],
  templateUrl: './navigation.html',
  styleUrl: '../../actions/actions-pages.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationNavigationPage {
  protected readonly tab = signal(0);
  protected readonly page = signal(4);

  protected readonly last = signal('');
  protected did(what: string): void {
    // The demo commands only say what they would do (mock).
    this.last.set(`${what} “Q3 revenue”.`);
  }

  // Sample settings sections (mock).
  protected readonly settings = [{ label: 'Profile' }, { label: 'Notifications' }, { label: 'Billing' }, { label: 'Members' }];
  protected readonly here = signal('Notifications');

  protected readonly plain = `<nav class="pr-breadcrumbs" aria-label="Breadcrumb">
  <ol>
    <li><a href="/">Primal</a></li>
    <li><a href="/navigation">Navigation</a></li>
    <li><span aria-current="page">Breadcrumbs</span></li>
  </ol>
</nav>

<!-- Tabs need script for their keys; this is their markup. -->
<div class="pr-tablist" role="tablist" aria-label="Q3 revenue report">
  <button type="button" role="tab" id="t1" aria-controls="p1" aria-selected="true">Summary</button>
  <button type="button" role="tab" id="t2" aria-controls="p2" aria-selected="false" tabindex="-1">Data</button>
</div>
<div role="tabpanel" id="p1" aria-labelledby="t1" tabindex="0">…</div>
<div role="tabpanel" id="p2" aria-labelledby="t2" tabindex="0" hidden>…</div>

<nav class="pr-pagination" aria-label="Invoices, pages">
  <ul>
    <li><a href="?page=3">Previous Page</a></li>
    <li><a href="?page=1" aria-label="Page 1">1</a></li>
    <li><span class="pr-pagination-gap" aria-hidden="true">…</span></li>
    <li><a href="?page=4" aria-label="Page 4" aria-current="page">4</a></li>
    <li><a href="?page=5">Next Page</a></li>
  </ul>
</nav>

<nav aria-label="Settings">
  <ul class="pr-nav-list">
    <li><a href="/settings/profile">Profile</a></li>
    <li><a href="/settings/notifications" aria-current="page">Notifications</a></li>
  </ul>
</nav>`;
}
