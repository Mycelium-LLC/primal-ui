import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PRIMAL_ACTIONS, PRIMAL_TABLES } from 'primal-angular';
import { PlainHtml } from '../../../shell/plain-html/plain-html';

// The work behind the demo buttons is pretend: a wait (mock).
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

@Component({
  selector: 'pr-actions-actions-page',
  imports: [PRIMAL_TABLES, PRIMAL_ACTIONS, PlainHtml, RouterLink],
  templateUrl: './actions.html',
  styleUrl: '../actions-pages.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionsActionsPage {
  protected readonly saves = signal(0);

  protected readonly save = async () => {
    this.saves.update((n) => n + 1);
    await wait(900);
    return 'Saved';
  };

  protected readonly startExport = async () => {
    await wait(300);
    return 'Export started';
  };

  protected readonly alignments = [
    { value: 'start', label: 'Start' },
    { value: 'center', label: 'Centre' },
    { value: 'end', label: 'End' },
  ] as const;
  protected readonly align = signal<'start' | 'center' | 'end'>('start');

  protected readonly plain = `<button type="button" class="pr-button-primary">Save Changes</button>
<button type="button">Duplicate Report</button>
<button type="button" class="pr-button-quiet">Preview Report</button>
<button type="button" class="pr-button-danger">Delete Report</button>

<!-- Working: busy, and not pressable until done. Check aria-busy before you act. -->
<button type="button" class="pr-button-primary" aria-busy="true">Save Changes</button>

<button type="button" class="pr-icon-button pr-button-quiet" aria-label="Close Panel" title="Close Panel">
  <svg viewBox="0 0 24 24" aria-hidden="true">…</svg>
</button>

<a href="https://example.com" target="_blank" rel="noopener noreferrer">Example<span class="pr-visually-hidden"> (opens in a new tab)</span></a>
<a href="/report.pdf" download>Download Report</a> <span class="pr-link-file">(PDF, 2 MB)</span>

<div class="pr-button-group" role="group" aria-label="Text alignment">
  <button type="button" aria-pressed="true">Start</button>
  <button type="button" aria-pressed="false">Centre</button>
  <button type="button" aria-pressed="false">End</button>
</div>

<div class="pr-actions">
  <button type="button" class="pr-button-danger">Delete Report</button>
  <div class="pr-actions-group">
    <button type="button" class="pr-button-quiet">Cancel Changes</button>
    <button type="button" class="pr-button-primary">Save Changes</button>
  </div>
</div>`;
}
