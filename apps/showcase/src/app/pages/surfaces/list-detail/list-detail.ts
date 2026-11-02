import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { PRIMAL_ACTIONS, PRIMAL_CONTENT, PRIMAL_FORMS, PRIMAL_TOP_LAYERS, PrimalToaster } from 'primal-angular';
import { Report, Reports } from '../reports';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** The list-with-detail surface: find, open, rename, delete with undo, create. */
@Component({
  selector: 'pr-surfaces-list-detail-page',
  imports: [PRIMAL_ACTIONS, PRIMAL_CONTENT, PRIMAL_FORMS, PRIMAL_TOP_LAYERS, RouterLink],
  templateUrl: './list-detail.html',
  styleUrls: ['../surfaces.css', '../../actions/actions-pages.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SurfacesListDetailPage {
  protected readonly reports = inject(Reports);
  private readonly router = inject(Router);
  private readonly toaster = inject(PrimalToaster);

  /** From the address: the report shown, if any. */
  readonly slug = input<string>();

  protected readonly report = computed(() => (this.slug() ? this.reports.find(this.slug()!) : undefined));
  protected readonly filter = signal('');
  protected readonly shown = computed(() => {
    const f = this.filter().trim().toLocaleLowerCase();
    return this.reports.all().filter((r) => !f || r.name.toLocaleLowerCase().includes(f));
  });

  protected readonly creating = signal(false);
  protected readonly renaming = signal(false);
  protected readonly newName = signal('');

  protected readonly create = async () => {
    const name = this.newName().trim();
    if (!name) return;
    await wait(400);
    const r = this.reports.create(name);
    this.creating.set(false);
    // A new thing opens, so the next move (fill it in, rename it) is already in reach.
    await this.router.navigate(['/surfaces/list-detail', r.slug]);
  };

  protected readonly rename = async () => {
    const name = this.newName().trim();
    const r = this.report();
    if (!name || !r) return;
    await wait(400);
    this.reports.rename(r.slug, name);
    this.renaming.set(false);
  };

  protected remove(r: Report): void {
    const undo = this.reports.remove(r.slug);
    // The item is gone, so focus goes to the list it was in, never to the top of the page.
    void this.router.navigate(['/surfaces/list-detail']).then(() => setTimeout(() => document.getElementById('reports-title')?.focus()));
    this.toaster.show(`Deleted “${r.name}”.`, {
      action: {
        label: 'Undo',
        run: () => {
          undo();
          void this.router.navigate(['/surfaces/list-detail', r.slug]);
        },
      },
    });
  }
}
