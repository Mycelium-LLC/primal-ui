import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  computed,
  contentChild,
  effect,
  inject,
  input,
  signal,
  untracked,
  viewChild,
  booleanAttribute,
} from '@angular/core';
import { PrimalControl } from './control';
import { PrimalForm } from './form';
import { PrimalListItem, PrimalListPopup, PrimalOption, firstEnabled, fold, lastEnabled, listKey, step, toItems } from './list';

/** An option split around the text the person typed, so the match can be marked. */
interface Shown extends PrimalListItem {
  before: string;
  match: string;
  after: string;
}

/**
 * A text field with a list of answers: clicking it shows every option, typing narrows them to
 * the ones that contain the text. The input stays native (typing, pasting, the phone's keyboard)
 * and holds the value. With `strict`, only one of the options is a valid answer.
 *
 *   <primal-field label="City">
 *     <primal-autocomplete [options]="cities">
 *       <input primalControl type="text" />
 *     </primal-autocomplete>
 *   </primal-field>
 */
@Component({
  selector: 'primal-autocomplete',
  host: { class: 'pr-autocomplete' },
  template: `
    <ng-content />
    <div #list popover="manual" class="pr-list" (mousedown)="$event.preventDefault()">
      <ul role="listbox" [id]="key" [attr.aria-labelledby]="control()?.labelId()">
        @for (item of shown(); track item.id) {
          @if (item.heading) {
            <li role="presentation" class="pr-list-heading">{{ item.heading }}</li>
          }
          <li
            role="option"
            class="pr-option"
            [id]="item.id"
            [attr.aria-selected]="item.value === value()"
            [attr.aria-disabled]="item.disabled ? 'true' : null"
            [class.pr-option-active]="item.id === activeId()"
            (pointermove)="item.disabled || active.set($index)"
            (click)="choose(item)"
          >
            <span>{{ item.before }}@if (item.match) {<mark class="pr-match">{{ item.match }}</mark>}{{ item.after }}</span>
          </li>
        }
      </ul>
      @if (!shown().length) {
        <p class="pr-list-empty">{{ emptyText() }}</p>
      }
    </div>
    <p class="pr-visually-hidden" aria-live="polite">{{ status() }}</p>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrimalAutocomplete {
  /** The answers to offer: strings, or { value, label, group, disabled }. */
  readonly options = input<(string | PrimalOption)[]>([]);
  /** Only one of the options is a valid answer; anything else gets the strict message. */
  readonly strict = input(false, { transform: booleanAttribute });
  /** What the field says when typing leaves nothing. {text} is what the person typed. */
  readonly emptyMessage = input('Nothing matches “{text}”.');
  /** The message when `strict` and the text is not one of the options. */
  readonly strictMessage = input('Choose one of the options in the list.');
  /**
   * What the list shows while the field is empty, in place of every option: recent searches,
   * popular pages. Give each a group ("Recent") so the list says what they are.
   */
  readonly blank = input<(string | PrimalOption)[]>();
  /** Open the list as soon as the field has focus, empty or not: a search box. */
  readonly openOnFocus = input(false, { transform: booleanAttribute });

  protected readonly control = contentChild(PrimalControl);
  private readonly list = viewChild.required<ElementRef<HTMLElement>>('list');
  private readonly form = inject(PrimalForm, { optional: true });
  private readonly destroyRef = inject(DestroyRef);

  protected readonly key = listKey();
  private readonly element = computed(() => this.control()?.element as HTMLInputElement | undefined);
  protected readonly popup = new PrimalListPopup(
    () => this.element()!,
    () => this.list().nativeElement,
    () => this.close(),
    this.destroyRef,
  );

  /** What is in the field now. */
  protected readonly value = signal('');
  /** The text the list is narrowed by: empty shows every option. */
  private readonly query = signal('');

  private readonly all = computed(() =>
    toItems(
      this.options().map((o) => (typeof o === 'string' ? { value: o, label: o } : o)),
      this.key,
    ),
  );

  private readonly blankItems = computed(() => {
    const blank = this.blank();
    return blank ? toItems(blank.map((o) => (typeof o === 'string' ? { value: o, label: o } : o)), `${this.key}-blank`) : null;
  });

  protected readonly shown = computed<Shown[]>(() => {
    const q = fold(this.query().trim());
    const out: Shown[] = [];
    let group: string | undefined;
    for (const item of (!q && this.blankItems()) || this.all()) {
      const at = q ? fold(item.label).indexOf(q) : -1;
      if (q && at < 0) continue;
      // A group's heading goes before the first option of it that is still shown.
      const heading = item.group && item.group !== group ? item.group : undefined;
      group = item.group;
      const len = q ? q.length : 0;
      out.push({
        ...item,
        heading,
        before: at < 0 ? item.label : item.label.slice(0, at),
        match: at < 0 ? '' : item.label.slice(at, at + len),
        after: at < 0 ? '' : item.label.slice(at + len),
      });
    }
    return out;
  });

  protected readonly active = signal(-1);
  protected readonly activeId = computed(() => this.shown()[this.active()]?.id ?? null);
  protected readonly emptyText = computed(() => this.emptyMessage().replace('{text}', this.query().trim()));
  protected readonly status = computed(() => {
    if (!this.popup.open()) return '';
    const n = this.shown().length;
    return n === 0 ? this.emptyText() : n === 1 ? '1 option.' : `${n} options.`;
  });

  constructor() {
    afterNextRender(() => {
      const el = this.element();
      if (!el) return;
      this.wire(el);
      this.value.set(el.value);
      this.validate();
    });
    effect(() => {
      this.all();
      this.strict();
      untracked(() => this.validate());
    });
    effect(() => {
      if (!this.form?.resets()) return;
      untracked(() =>
        setTimeout(() => {
          this.value.set(this.element()?.value ?? '');
          this.validate();
        }),
      );
    });
    // aria-activedescendant follows the active option while the list is open.
    effect(() => {
      const el = this.element();
      if (!el) return;
      const id = this.popup.open() ? this.activeId() : null;
      if (id) el.setAttribute('aria-activedescendant', id);
      else el.removeAttribute('aria-activedescendant');
      el.setAttribute('aria-expanded', String(this.popup.open()));
    });
  }

  protected choose(item: PrimalListItem): void {
    if (item.disabled) return;
    const el = this.element();
    if (!el) return;
    el.value = item.value;
    this.value.set(item.value);
    this.validate();
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
    this.close();
  }

  private wire(el: HTMLInputElement): void {
    el.setAttribute('role', 'combobox');
    el.setAttribute('aria-autocomplete', 'list');
    el.setAttribute('aria-controls', this.key);
    el.setAttribute('aria-expanded', 'false');
    // The browser's own autofill list would open over Primal's.
    if (!el.hasAttribute('autocomplete')) el.setAttribute('autocomplete', 'off');
    const on = <K extends keyof HTMLElementEventMap>(type: K, fn: (e: HTMLElementEventMap[K]) => void) => {
      el.addEventListener(type, fn);
      this.destroyRef.onDestroy(() => el.removeEventListener(type, fn));
    };
    // A click that gave the field focus already opened it (openOnFocus): it must not close it again.
    let focusedAt = 0;
    on('focus', () => {
      if (!this.openOnFocus() || this.popup.open()) return;
      focusedAt = Date.now();
      this.openFull();
    });
    on('click', () => {
      if (Date.now() - focusedAt < 400) return;
      if (this.popup.open()) this.close();
      else this.openFull();
    });
    on('input', () => {
      this.value.set(el.value);
      this.validate();
      this.query.set(el.value);
      this.active.set(-1);
      if (!el.matches(':disabled') && !el.readOnly) this.popup.show();
    });
    on('keydown', (e) => this.onKey(e, el));
    on('blur', () => {
      this.close();
      // "lisbon" is Lisbon: text that is one of the options but for its case or accents becomes it.
      const same = this.all().find((i) => !i.disabled && fold(i.label) === fold(el.value.trim()));
      if (same && same.value !== el.value) this.choose(same);
    });
  }

  /** Opening from a click or an arrow shows every option; a chosen answer is marked and in view. */
  private openFull(): void {
    const el = this.element();
    if (!el || el.matches(':disabled') || el.readOnly) return;
    const exact = this.all().find((i) => i.value === el.value);
    // A search box keeps what was typed: opening it again shows the same results.
    this.query.set((exact && !this.openOnFocus()) || !el.value ? '' : el.value);
    const at = exact ? this.shown().findIndex((i) => i.id === exact.id) : -1;
    this.active.set(at);
    this.popup.show();
    this.popup.reveal(this.activeId());
  }

  private onKey(e: KeyboardEvent, el: HTMLInputElement): void {
    const open = this.popup.open();
    const items = this.shown();
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (!open) return this.openFull();
        if (e.altKey) return;
        return this.setActive(this.active() < 0 ? firstEnabled(items) : step(items, this.active(), 1));
      case 'ArrowUp':
        e.preventDefault();
        if (!open) return this.openFull();
        return this.setActive(this.active() < 0 ? lastEnabled(items) : step(items, this.active(), -1));
      case 'Enter': {
        const item = items[this.active()];
        if (!open || !item) return;
        e.preventDefault();
        return this.choose(item);
      }
      case 'Escape':
        e.preventDefault();
        if (open) return this.close();
        if (el.value) {
          el.value = '';
          el.dispatchEvent(new Event('input', { bubbles: true }));
          this.close();
        }
        return;
      case 'Tab':
        this.close();
    }
  }

  private setActive(index: number): void {
    this.active.set(index);
    this.popup.reveal(this.activeId());
  }

  private close(): void {
    this.popup.hide();
    this.active.set(-1);
  }

  /** With `strict`, text that isn't one of the options is invalid, and says what to do. */
  private validate(): void {
    const el = this.element();
    if (!el) return;
    const ok = !this.strict() || !el.value || this.all().some((i) => i.value === el.value);
    el.setCustomValidity(ok ? '' : this.strictMessage());
    this.control()?.check();
  }
}
