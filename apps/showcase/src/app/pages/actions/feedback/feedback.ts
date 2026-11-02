import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PRIMAL_ACTIONS, PRIMAL_FEEDBACK, PrimalToaster } from 'primal-angular';
import { PlainHtml } from '../../../shell/plain-html/plain-html';

// Sample reports and people for the examples (mock data).
const REPORTS = [
  { id: 1, name: 'Q3 revenue' },
  { id: 2, name: 'Churn by plan' },
  { id: 3, name: 'Weekly signups' },
];

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

@Component({
  selector: 'pr-actions-feedback-page',
  imports: [PRIMAL_ACTIONS, PRIMAL_FEEDBACK, PlainHtml, RouterLink],
  templateUrl: './feedback.html',
  styleUrl: '../actions-pages.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionsFeedbackPage {
  private readonly toaster = inject(PrimalToaster);

  protected readonly reports = signal(REPORTS);

  protected remove(report: (typeof REPORTS)[number]): void {
    // Focus moves to the next row's Delete (or the list's way back), never to the top of the page.
    const rows = [...document.querySelectorAll<HTMLElement>('.pr-demo-reports li')];
    const at = rows.findIndex((li) => li.contains(document.activeElement));
    setTimeout(() => {
      const left = [...document.querySelectorAll<HTMLElement>('.pr-demo-reports li button')];
      (left[Math.min(Math.max(at, 0), left.length - 1)] ?? null)?.focus();
    });
    const before = this.reports();
    this.reports.update((list) => list.filter((r) => r.id !== report.id));
    this.toaster.show(`Deleted “${report.name}”.`, {
      action: { label: 'Undo', run: () => this.reports.set(before) },
    });
  }

  protected restoreAll(): void {
    this.reports.set(REPORTS);
  }

  protected readonly exportAll = async () => {
    await wait(300);
    // The export finishes later, while the person may be elsewhere: that is what a toast is for (mock).
    setTimeout(() => this.toaster.show('Your reports are exported: 3 files in Downloads.'), 2500);
    return 'Export started';
  };

  protected readonly people = [
    { name: 'Ada Shapiro', role: 'Owner' },
    { name: 'Noa Levi', role: 'Editor' },
    { name: 'Sam Okafor', role: 'Viewer' },
  ];
  protected readonly loadingPeople = signal(false);

  protected async reloadPeople(): Promise<void> {
    this.loadingPeople.set(true);
    await wait(1800);
    this.loadingPeople.set(false);
  }

  protected readonly uploaded = signal(0);
  protected readonly uploading = signal(false);

  protected async upload(): Promise<void> {
    this.uploading.set(true);
    this.uploaded.set(0);
    for (let i = 1; i <= 12; i++) {
      await wait(250);
      this.uploaded.set(i);
    }
    this.uploading.set(false);
  }

  protected readonly plain = `<div class="pr-alert" data-tone="warning">
  <p class="pr-alert-title">Your plan ends in 3 days</p>
  <p>Renew it to keep your reports.</p>
  <div class="pr-alert-actions"><button type="button" class="pr-button-primary">Renew Plan</button></div>
</div>

<!-- A banner: the alert, edge to edge. -->
<div class="pr-alert pr-banner" data-tone="warning" role="status">…</div>

<!-- A toast needs script to come and go; this is its markup. -->
<div class="pr-toaster" popover="manual" role="region" aria-label="Notifications">
  <div class="pr-toast">
    <p class="pr-toast-message">Deleted “Q3 revenue”.</p>
    <button type="button">Undo</button>
  </div>
</div>

<div class="pr-progress">
  <span id="up">Uploading 12 photos</span>
  <span class="pr-progress-value" aria-hidden="true">50%</span>
  <progress aria-labelledby="up" value="6" max="12"></progress>
</div>

<ul aria-busy="true">
  <li><span class="pr-skeleton" data-shape="circle" aria-hidden="true"></span>
      <span class="pr-skeleton" data-shape="text" aria-hidden="true"></span></li>
</ul>

<span class="pr-spinner" role="status"><span class="pr-visually-hidden">Loading</span></span>`;
}
