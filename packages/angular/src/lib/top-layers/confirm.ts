import {
  ApplicationRef,
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  EnvironmentInjector,
  Injectable,
  createComponent,
  inject,
  signal,
} from '@angular/core';
import { PrimalButton } from '../actions/button';
import { PrimalActionKind } from '../behaviour/model';
import { PrimalDialog } from './dialog';

export interface PrimalConfirmOptions {
  readonly title: string;
  /** What happens, and what it costs, in a sentence or two. */
  readonly body?: string;
  /** The answer that goes ahead, repeating the action: "Delete Workspace", never "OK". */
  readonly confirm: string;
  /** The answer that changes nothing: "Keep Workspace", never "Cancel" alone. */
  readonly cancel: string;
  /** The kind of the action it confirms. A destructive one gets the final danger fill, and focus starts on the way out. */
  readonly kind?: PrimalActionKind;
}

/**
 * Asks a real question once, and waits: a confirmation dialog. Only for something that cannot be
 * undone; anything that can be undone is done, with Undo. Resolves true for the confirm, false
 * for every way out.
 *
 *   if (await inject(PrimalConfirm).ask({ title: 'Delete “Acme Studio” for good?', confirm: 'Delete Workspace', cancel: 'Keep Workspace', kind: 'destructive' })) …
 */
@Injectable({ providedIn: 'root' })
export class PrimalConfirm {
  private readonly appRef = inject(ApplicationRef);
  private readonly injector = inject(EnvironmentInjector);
  private readonly document = inject(DOCUMENT);

  ask(options: PrimalConfirmOptions): Promise<boolean> {
    return new Promise((resolve) => {
      const ref = createComponent(PrimalConfirmDialog, { environmentInjector: this.injector });
      ref.instance.options.set(options);
      ref.instance.done = (answer) => {
        resolve(answer);
        // Let the dialog leave before it is removed.
        setTimeout(() => {
          this.appRef.detachView(ref.hostView);
          ref.destroy();
        }, 300);
      };
      this.appRef.attachView(ref.hostView);
      this.document.body.append(ref.location.nativeElement);
      ref.changeDetectorRef.detectChanges();
      ref.instance.open.set(true);
    });
  }
}

@Component({
  selector: 'primal-confirm-dialog',
  imports: [PrimalDialog, PrimalButton],
  template: `
    @if (options(); as o) {
      <primal-dialog [title]="o.title" [description]="o.body" [(open)]="open" (dismissed)="answer(false)">
        <div class="pr-dialog-actions" dialog-actions>
          <button primalButton type="button" emphasis="quiet" [attr.autofocus]="o.kind === 'destructive' ? '' : null" (click)="answer(false)">{{ o.cancel }}</button>
          <button primalButton type="button" emphasis="primary" [kind]="o.kind ?? 'confirmatory'" [final]="o.kind === 'destructive'" (click)="answer(true)">{{ o.confirm }}</button>
        </div>
      </primal-dialog>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrimalConfirmDialog {
  readonly options = signal<PrimalConfirmOptions | null>(null);
  readonly open = signal(false);
  done: (answer: boolean) => void = () => undefined;
  private answered = false;

  protected answer(yes: boolean): void {
    if (this.answered) return;
    this.answered = true;
    this.open.set(false);
    this.done(yes);
  }
}
