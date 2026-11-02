import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, computed, inject, input, output, signal } from '@angular/core';
import { PrimalAnnouncer } from '../behaviour/announcer';
import { PrimalActionTreatment } from './treatment';

/** The work behind a button. What it returns is the word the button says when it is done ("Saved"). */
export type PrimalRun = () => Promise<string | void> | string | void;

/** The shortest a button stays busy: a pause this long reads as intentional, not as a flicker. */
const MIN_BUSY = 450;
/** How long a button says its outcome before its label comes back. */
const SAID_FOR = 2000;

/**
 * An action. Its label is the person's verb and an object ("Save Changes"). Give it its work
 * with [run], and it keeps the feedback contract on its own: it is busy at once (a spinner, its
 * size held), cannot be pressed twice while busy, and says its outcome where it is ("Saved"),
 * which is also announced.
 *
 *   <button primalButton emphasis="primary" kind="mutative" [run]="save">Save Changes</button>
 *
 * Without [run], set [busy] yourself. A destructive kind always wears the danger edge.
 */
@Component({
  selector: 'button[primalButton], a[primalButton]',
  host: {
    '[attr.aria-busy]': "working() ? 'true' : null",
  },
  template: `
    <span class="pr-button-face">
      <span class="pr-button-label" [hidden]="!!said()"><ng-content /></span>
      @if (said(); as words) {
        <span class="pr-button-said" aria-hidden="true">{{ words }}</span>
      }
    </span>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrimalButton extends PrimalActionTreatment {
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly announcer = inject(PrimalAnnouncer);
  protected readonly isLink = this.element instanceof HTMLAnchorElement;

  /** The work to do on press. While it runs the button is busy; a second press does nothing. */
  readonly run = input<PrimalRun>();
  /** Busy from outside, when you run the work yourself. */
  readonly busy = input(false);
  /** The work failed. Show the failure beside the thing that failed; the button is ready again. */
  readonly failed = output<unknown>();

  private readonly running = signal(false);
  protected readonly working = computed(() => this.busy() || this.running());
  protected readonly said = signal<string | null>(null);
  private saidTimer?: ReturnType<typeof setTimeout>;

  constructor() {
    super();
    // Capture, so the guard runs before any (click) on the same button.
    const guard = (event: Event) => {
      if (this.working()) {
        event.preventDefault();
        event.stopImmediatePropagation();
        return;
      }
      const run = this.run();
      if (run) void this.execute(run);
    };
    this.element.addEventListener('click', guard, { capture: true });
    inject(DestroyRef).onDestroy(() => {
      this.element.removeEventListener('click', guard, { capture: true });
      clearTimeout(this.saidTimer);
    });
  }

  private async execute(run: PrimalRun): Promise<void> {
    clearTimeout(this.saidTimer);
    this.said.set(null);
    this.running.set(true);
    try {
      const [words] = await Promise.all([run(), new Promise((r) => setTimeout(r, MIN_BUSY))]);
      if (words) {
        this.said.set(words);
        this.announcer.announce(words);
        this.saidTimer = setTimeout(() => this.said.set(null), SAID_FOR);
      }
    } catch (error) {
      this.failed.emit(error);
    } finally {
      this.running.set(false);
    }
  }
}
