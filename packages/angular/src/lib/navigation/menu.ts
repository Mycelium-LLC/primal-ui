import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  Directive,
  ElementRef,
  afterNextRender,
  contentChild,
  contentChildren,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { primalLayerId, primalPlace } from '../top-layers/place';

/** The button that opens a menu. */
@Directive({ selector: '[primalMenuTrigger]' })
export class PrimalMenuTrigger {
  readonly element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
}

/**
 * One command in a menu: the person's verb and an object ("Rename Report"). Give it
 * kind="destructive" when it takes something away, and aria-disabled when it can't be done now.
 */
@Directive({
  selector: 'button[primalMenuItem]',
  host: { role: 'menuitem', tabindex: '-1', '[attr.data-kind]': 'kind()' },
})
export class PrimalMenuItem {
  readonly element = inject<ElementRef<HTMLButtonElement>>(ElementRef).nativeElement;
  readonly kind = input<string>();
}

/**
 * A button that opens a short list of commands. The menu is a popover beside the page: the page
 * stays the person's own, and pressing outside closes it.
 *
 * Keys: Enter, Space or ↓ on the button open it on the first command, ↑ on the last; ↑ ↓ move,
 * Home and End go to the ends, a letter goes to the next command starting with it; Enter runs a
 * command; Escape or Tab closes it. Closing returns focus to the button.
 *
 *   <primal-menu label="Report actions">
 *     <button primalMenuTrigger primalIconButton label="Show Report Actions">…</button>
 *     <button primalMenuItem (click)="rename()">Rename Report</button>
 *     <hr />
 *     <button primalMenuItem kind="destructive" (click)="remove()">Delete Report</button>
 *   </primal-menu>
 */
@Component({
  selector: 'primal-menu',
  host: { class: 'pr-menu-host' },
  styles: `
    :host {
      display: inline-block;
    }
  `,
  template: `
    <ng-content select="[primalMenuTrigger]" />
    <div #menu class="pr-menu" popover="auto" role="menu" [id]="id" [attr.aria-label]="label()" (keydown)="key($event)" (click)="ran($event)" (toggle)="toggled($event)">
      <ng-content />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrimalMenu {
  /** What the commands are about, read aloud: "Report actions". */
  readonly label = input.required<string>();

  private readonly trigger = contentChild.required(PrimalMenuTrigger);
  private readonly items = contentChildren(PrimalMenuItem);
  private readonly menu = viewChild.required<ElementRef<HTMLElement>>('menu');

  protected readonly id = primalLayerId('menu');
  private readonly open = signal(false);
  private closedAt = 0;
  private typed = '';
  private typedTimer?: ReturnType<typeof setTimeout>;

  constructor() {
    const destroy = inject(DestroyRef);
    afterNextRender(() => {
      const button = this.trigger().element;
      button.setAttribute('aria-haspopup', 'menu');
      button.setAttribute('aria-controls', this.id);
      button.setAttribute('aria-expanded', 'false');
      // A press on the button while open closes the popover first (light dismiss); it must not reopen it.
      const click = () => {
        if (Date.now() - this.closedAt < 300) return;
        if (this.open()) this.close(true);
        else this.show(0);
      };
      const keydown = (e: KeyboardEvent) => {
        if (e.key === 'ArrowDown' || ((e.key === 'Enter' || e.key === ' ') && !this.open())) {
          e.preventDefault();
          this.show(0);
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          this.show(-1);
        }
      };
      button.addEventListener('click', click);
      button.addEventListener('keydown', keydown);
      const place = () => this.open() && primalPlace(button, this.menu().nativeElement);
      window.addEventListener('resize', place);
      window.addEventListener('scroll', place, true);
      destroy.onDestroy(() => {
        button.removeEventListener('click', click);
        button.removeEventListener('keydown', keydown);
        window.removeEventListener('resize', place);
        window.removeEventListener('scroll', place, true);
      });
    });
  }

  /** Opens on the command at `at` (-1 is the last). */
  private show(at: number): void {
    const menu = this.menu().nativeElement;
    if (!menu.matches(':popover-open')) menu.showPopover();
    primalPlace(this.trigger().element, menu);
    const items = this.enabled();
    items.at(at)?.focus();
  }

  private close(focusTrigger: boolean): void {
    const menu = this.menu().nativeElement;
    if (menu.matches(':popover-open')) menu.hidePopover();
    if (focusTrigger) this.trigger().element.focus();
  }

  protected toggled(e: Event): void {
    const open = (e as ToggleEvent).newState === 'open';
    this.open.set(open);
    if (!open) this.closedAt = Date.now();
    this.trigger().element.setAttribute('aria-expanded', String(open));
    // Closed by Escape or a press outside while focus was in it: focus goes back to the button.
    if (!open && this.menu().nativeElement.contains(document.activeElement)) this.trigger().element.focus();
  }

  /** A command ran: the menu closes and focus returns to its button. */
  protected ran(e: Event): void {
    const item = (e.target as HTMLElement).closest('[role="menuitem"]');
    if (!item) return;
    if (item.getAttribute('aria-disabled') === 'true') {
      e.stopPropagation();
      return;
    }
    this.close(true);
  }

  protected key(e: KeyboardEvent): void {
    const items = this.enabled();
    const at = items.indexOf(document.activeElement as HTMLButtonElement);
    const go = (i: number) => {
      e.preventDefault();
      items.at(((i % items.length) + items.length) % items.length)?.focus();
    };
    switch (e.key) {
      case 'ArrowDown':
        return go(at + 1);
      case 'ArrowUp':
        return go(at - 1);
      case 'Home':
        return go(0);
      case 'End':
        return go(-1);
      case 'Tab':
        return this.close(false);
      case 'Escape':
        e.preventDefault();
        e.stopPropagation();
        return this.close(true);
    }
    if (e.key.length === 1 && /\S/.test(e.key)) {
      clearTimeout(this.typedTimer);
      this.typed += e.key.toLowerCase();
      this.typedTimer = setTimeout(() => (this.typed = ''), 600);
      const from = this.typed.length === 1 ? at + 1 : at;
      const order = [...items.slice(from), ...items.slice(0, from)];
      order.find((i) => i.textContent?.trim().toLowerCase().startsWith(this.typed))?.focus();
    }
  }

  /** Commands that can be reached: disabled ones are skipped, aria-disabled ones are reachable but do nothing. */
  private enabled(): HTMLButtonElement[] {
    return this.items()
      .map((i) => i.element)
      .filter((el) => !el.disabled);
  }
}
