import { DOCUMENT, DestroyRef, Directive, ElementRef, effect, inject, input, model } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

/**
 * The app shell's menu button, on a phone: it opens the shell's navigation over the place, and
 * keeps everything that goes with it, so no app writes it again.
 *
 *   <button primalIconButton class="pr-shell-menu" [primalShellMenu]="nav" #menu="primalShellMenu"
 *           [label]="menu.open() ? 'Close Menu' : 'Show Menu'"> … </button>
 *   <nav class="pr-shell-nav" #nav aria-label="Places"> … </nav>
 *
 * The button says whether it is open (aria-expanded) and what it opens (aria-controls). Opening
 * moves focus to the current place, or the first; Escape closes it and returns focus to the
 * button; choosing a place, or any navigation, closes it. On a desk the navigation always shows,
 * and the button is hidden by the shell's CSS.
 */
@Directive({
  selector: 'button[primalShellMenu]',
  exportAs: 'primalShellMenu',
  host: {
    type: 'button',
    '[attr.aria-expanded]': 'open()',
    '[attr.aria-controls]': 'controls()',
    '(click)': 'toggle()',
  },
})
export class PrimalShellMenu {
  private readonly document = inject(DOCUMENT);
  private readonly button = inject<ElementRef<HTMLButtonElement>>(ElementRef).nativeElement;
  /** The shell's navigation element. */
  readonly nav = input.required<HTMLElement>({ alias: 'primalShellMenu' });
  readonly open = model(false);

  constructor() {
    const destroy = inject(DestroyRef);
    // Shown or not, on the navigation itself: the shell's CSS reads data-open.
    effect(() => {
      const nav = this.nav();
      if (this.open()) nav.setAttribute('data-open', '');
      else nav.removeAttribute('data-open');
    });
    const keys = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || !this.open()) return;
      event.preventDefault();
      this.close(true);
    };
    const chose = (event: Event) => {
      if (this.open() && (event.target as HTMLElement).closest('a[href]')) this.close(false);
    };
    this.document.addEventListener('keydown', keys);
    this.document.addEventListener('click', chose);
    const routes = inject(Router, { optional: true })?.events.subscribe((e) => e instanceof NavigationEnd && this.open() && this.close(false));
    destroy.onDestroy(() => {
      this.document.removeEventListener('keydown', keys);
      this.document.removeEventListener('click', chose);
      routes?.unsubscribe();
    });
  }

  protected controls(): string {
    const nav = this.nav();
    return (nav.id ||= `pr-shell-nav-${++next}`);
  }

  toggle(): void {
    if (this.open()) return this.close(true);
    this.open.set(true);
    // Into the navigation, at the current place: where the person most likely is going next.
    setTimeout(() => {
      const nav = this.nav();
      (nav.querySelector<HTMLElement>('[aria-current="page"]') ?? nav.querySelector<HTMLElement>('a[href], button:not([disabled])'))?.focus();
    });
  }

  /** Closes it; with `back`, focus returns to the button (Escape, or the button itself). */
  close(back: boolean): void {
    this.open.set(false);
    if (back) this.button.focus();
  }
}

let next = 0;
