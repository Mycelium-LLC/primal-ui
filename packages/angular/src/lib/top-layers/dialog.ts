import { ChangeDetectionStrategy, Component, ElementRef, effect, input, model, output, viewChild } from '@angular/core';
import { primalLayerId } from './place';

/**
 * A dialog interrupts: the page behind it is covered and holds still, and the one thing to do is
 * answer it. It always has a way out that isn't the answer (Close, Escape, a press on the
 * backdrop), returns the page exactly as it was, and is not a place: it has no address, and Back
 * never lands in it. On a phone it rises from the bottom edge.
 *
 * Keys: Tab moves within it only; Escape closes it (the topmost layer only). On close, focus
 * returns to what opened it.
 *
 *   <primal-dialog title="Rename report" [(open)]="renaming">
 *     <primal-field label="Name"><input primalControl … /></primal-field>
 *     <div class="pr-dialog-actions" dialog-actions>
 *       <button primalButton emphasis="quiet" (click)="renaming.set(false)">Keep Name</button>
 *       <button primalButton emphasis="primary" [run]="rename">Rename Report</button>
 *     </div>
 *   </primal-dialog>
 *
 * Use it only when the work cannot go on without the answer. Something that can be undone is not
 * asked: it is undone.
 */
@Component({
  selector: 'primal-dialog',
  template: `
    <dialog #dialog class="pr-dialog" tabindex="-1" [attr.aria-labelledby]="titleId" [attr.aria-describedby]="description() ? descriptionId : null"
      (close)="closed()" (cancel)="cancel($event)" (click)="backdrop($event)">
      <div class="pr-dialog-header">
        <h2 class="pr-dialog-title" [id]="titleId">{{ title() }}</h2>
        @if (dismissible()) {
          <button type="button" class="pr-icon-button pr-button-quiet pr-dialog-close" [attr.aria-label]="closeLabel()" [attr.title]="closeLabel()" (click)="open.set(false)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>
          </button>
        }
      </div>
      <div class="pr-dialog-body">
        @if (description()) {
          <p [id]="descriptionId">{{ description() }}</p>
        }
        <ng-content />
      </div>
      <ng-content select="[dialog-actions]" />
    </dialog>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrimalDialog {
  readonly title = input.required<string>();
  /** One sentence under the title, read when the dialog opens. */
  readonly description = input<string>();
  readonly open = model(false);
  /** Close, Escape and the backdrop close it. Turn off only while it is working on the answer. */
  readonly dismissible = input(true);
  readonly closeLabel = input('Close Dialog');
  /** It closed, by any way out. */
  readonly dismissed = output<void>();

  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');
  protected readonly titleId = primalLayerId('dialog-title');
  protected readonly descriptionId = primalLayerId('dialog-description');

  constructor() {
    effect(() => {
      const dialog = this.dialog().nativeElement;
      if (this.open() && !dialog.open) {
        dialog.showModal();
        // The dialog itself takes focus, so its title is read first; Tab goes to the first control.
        if (!dialog.querySelector('[autofocus]')) dialog.focus();
      } else if (!this.open() && dialog.open) {
        dialog.close();
      }
    });
  }

  protected closed(): void {
    if (this.open()) this.open.set(false);
    this.dismissed.emit();
  }

  protected cancel(e: Event): void {
    if (!this.dismissible()) e.preventDefault();
  }

  /** A press on the backdrop (outside the dialog's box) is a way out. */
  protected backdrop(e: MouseEvent): void {
    if (!this.dismissible() || e.target !== this.dialog().nativeElement) return;
    const r = this.dialog().nativeElement.getBoundingClientRect();
    const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
    if (!inside) this.open.set(false);
  }
}
