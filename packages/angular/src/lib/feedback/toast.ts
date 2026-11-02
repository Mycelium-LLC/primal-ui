import {
  ApplicationRef,
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  DestroyRef,
  ElementRef,
  EnvironmentInjector,
  Injectable,
  createComponent,
  inject,
  signal,
} from '@angular/core';

export interface PrimalToastAction {
  /** The person's verb: "Undo", "View Report". */
  readonly label: string;
  readonly run: () => void;
}

export interface PrimalToastOptions {
  /** One action, usually Undo. A toast with an action stays longer: that is its window. */
  readonly action?: PrimalToastAction;
  /** How long it stays, in milliseconds. 5 seconds, or 8 with an action. */
  readonly duration?: number;
}

export interface PrimalToastRef {
  dismiss(): void;
}

interface Toast {
  readonly id: number;
  readonly message: string;
  readonly action?: PrimalToastAction;
  readonly duration: number;
  readonly leaving: boolean;
}

/** At most this many at once; a newer one pushes the oldest out. */
const MOST = 3;
/** How long a toast takes to leave. */
const LEAVE = 150;

/**
 * Place: toast, the corner, the one raised voice. It says what just happened where the person can
 * no longer see it (the row is gone, the export finished), holds its undo, and fades. Never for
 * a routine outcome, a lasting fact, a question or an error to fix.
 *
 *   inject(PrimalToaster).show('Deleted “Q3 report”.', { action: { label: 'Undo', run: restore } });
 *
 * The toaster puts itself on the page the first time it is used. It waits while it is pointed at
 * or holds focus, so nobody loses an undo by reading slowly.
 */
@Injectable({ providedIn: 'root' })
export class PrimalToaster {
  private readonly appRef = inject(ApplicationRef);
  private readonly injector = inject(EnvironmentInjector);
  private readonly document = inject(DOCUMENT);
  private host?: PrimalToasterRegion;
  private nextId = 0;

  show(message: string, options: PrimalToastOptions = {}): PrimalToastRef {
    const region = (this.host ??= this.attach());
    const id = ++this.nextId;
    const duration = options.duration ?? (options.action ? 8000 : 5000);
    region.add({ id, message, action: options.action, duration, leaving: false });
    return { dismiss: () => region.remove(id) };
  }

  private attach(): PrimalToasterRegion {
    const ref = createComponent(PrimalToasterRegion, { environmentInjector: this.injector });
    this.appRef.attachView(ref.hostView);
    this.document.body.append(ref.location.nativeElement);
    return ref.instance;
  }
}

@Component({
  selector: 'primal-toaster',
  host: {
    class: 'pr-toaster',
    popover: 'manual',
    role: 'region',
    'aria-label': 'Notifications',
    '(pointerenter)': 'hold(true)',
    '(pointerleave)': 'hold(false)',
    '(focusin)': 'hold(true)',
    '(focusout)': 'hold(false)',
    '(keydown.escape)': 'closeNewest()',
  },
  template: `
    <div class="pr-visually-hidden" aria-live="polite" aria-atomic="false">
      @for (t of toasts(); track t.id) {
        <p dir="auto">{{ t.message }}</p>
      }
    </div>
    @for (t of toasts(); track t.id) {
      <div class="pr-toast" [attr.data-leaving]="t.leaving ? '' : null">
        <p class="pr-toast-message" dir="auto">{{ t.message }}</p>
        @if (t.action; as action) {
          <button type="button" (click)="act(t, action)">{{ action.label }}</button>
        }
        <button type="button" class="pr-toast-close" aria-label="Close Message" title="Close Message" (click)="remove(t.id)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>
        </button>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrimalToasterRegion {
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly document = inject(DOCUMENT);
  protected readonly toasts = signal<Toast[]>([]);
  private readonly timers = new Map<number, { left: number; started: number; timer?: ReturnType<typeof setTimeout> }>();
  private held = false;

  constructor() {
    // A modal dialog makes everything outside it inert, a toast's Undo included. So while one is
    // open the toaster lives inside the topmost one, and comes back to the page when it closes.
    const watch = new MutationObserver(() => this.follow());
    watch.observe(this.document.body, { subtree: true, attributes: true, attributeFilter: ['open'] });
    inject(DestroyRef).onDestroy(() => watch.disconnect());
  }

  /** Puts the toaster in the topmost open modal dialog, or in the page, and keeps it on top. */
  private follow(): void {
    const dialogs = [...this.document.querySelectorAll('dialog')].filter((d) => d.matches(':modal'));
    const home = dialogs.at(-1) ?? this.document.body;
    if (this.element.parentElement === home) return;
    home.append(this.element);
    // Moving it closes it; it opens again, above everything there.
    if (this.toasts().some((t) => !t.leaving)) this.element.showPopover();
  }

  add(toast: Toast): void {
    this.follow();
    const shown = this.toasts().filter((t) => !t.leaving);
    if (shown.length >= MOST) this.remove(shown[0].id);
    this.toasts.update((list) => [...list, toast]);
    this.timers.set(toast.id, { left: toast.duration, started: Date.now() });
    if (!this.held) this.start(toast.id);
    // Opened again on each toast, so it rises above anything opened since.
    if (this.element.matches(':popover-open')) this.element.hidePopover();
    this.element.showPopover();
  }

  remove(id: number): void {
    const t = this.timers.get(id);
    if (t) clearTimeout(t.timer);
    this.timers.delete(id);
    this.toasts.update((list) => list.map((x) => (x.id === id ? { ...x, leaving: true } : x)));
    setTimeout(() => {
      this.toasts.update((list) => list.filter((x) => x.id !== id));
      if (!this.toasts().length && this.element.matches(':popover-open')) this.element.hidePopover();
    }, LEAVE);
  }

  protected act(toast: Toast, action: PrimalToastAction): void {
    action.run();
    this.remove(toast.id);
  }

  protected closeNewest(): void {
    const shown = this.toasts().filter((t) => !t.leaving);
    if (shown.length) this.remove(shown[shown.length - 1].id);
  }

  protected hold(on: boolean): void {
    if (!on && this.element.contains(this.document.activeElement)) return;
    this.held = on;
    for (const [id, t] of this.timers) {
      if (on) {
        clearTimeout(t.timer);
        t.left -= Date.now() - t.started;
      } else this.start(id);
    }
  }

  private start(id: number): void {
    const t = this.timers.get(id);
    if (!t) return;
    t.started = Date.now();
    t.timer = setTimeout(() => this.remove(id), Math.max(t.left, 1000));
  }
}
