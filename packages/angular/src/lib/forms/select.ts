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
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { PrimalControl } from './control';
import { PRIMAL_SELECT_SET, primalApplyWanted } from './select-value';
import { PrimalForm } from './form';
import { PrimalListItem, PrimalListPopup, firstEnabled, fold, lastEnabled, listKey, step, toItems } from './list';

/**
 * A select whose list Primal draws, instead of the system's popup. The native select stays
 * inside, out of sight, as the value: forms APIs, required, reset and submission all work on it
 * unchanged. The person operates a button with the keyboard of a native select.
 *
 *   <primal-field label="Country">
 *     <primal-select>
 *       <select primalControl required>
 *         <option value="">Choose a country</option>
 *         <option>Israel</option>
 *       </select>
 *     </primal-select>
 *   </primal-field>
 */
@Component({
  selector: 'primal-select',
  host: { class: 'pr-select' },
  template: `
    <ng-content />
    <button
      #trigger
      type="button"
      class="pr-select-trigger"
      role="combobox"
      aria-haspopup="listbox"
      [id]="key + '-trigger'"
      [attr.aria-expanded]="popup.open()"
      [attr.aria-controls]="key"
      [attr.aria-activedescendant]="popup.open() ? activeId() : null"
      [attr.aria-labelledby]="control()?.labelId()"
      [attr.aria-describedby]="control()?.describedBy()"
      [attr.aria-invalid]="control()?.showError() ? 'true' : null"
      [attr.aria-required]="required() ? 'true' : null"
      [disabled]="disabled()"
      (click)="toggle()"
      (keydown)="onKey($event)"
      (blur)="onBlur()"
    >
      <span class="pr-select-value" [class.pr-select-placeholder]="placeholder()">{{ shown() }}</span>
    </button>
    <div #list popover="manual" class="pr-list" (mousedown)="$event.preventDefault()">
      <ul role="listbox" [id]="key" [attr.aria-labelledby]="control()?.labelId()">
        @for (item of items(); track item.id) {
          @if (item.heading) {
            <li role="presentation" class="pr-list-heading">{{ item.heading }}</li>
          }
          <li
            role="option"
            class="pr-option"
            [id]="item.id"
            [attr.aria-selected]="item.index === selected()"
            [attr.aria-disabled]="item.disabled ? 'true' : null"
            [class.pr-option-active]="item.index === active()"
            (pointermove)="item.disabled || active.set(item.index)"
            (click)="choose(item)"
          >
            <span>{{ item.label }}</span>
          </li>
        }
      </ul>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrimalSelect {
  protected readonly control = contentChild(PrimalControl);
  private readonly trigger = viewChild.required<ElementRef<HTMLButtonElement>>('trigger');
  private readonly list = viewChild.required<ElementRef<HTMLElement>>('list');
  private readonly form = inject(PrimalForm, { optional: true });
  private readonly destroyRef = inject(DestroyRef);

  protected readonly key = listKey();
  protected readonly popup = new PrimalListPopup(
    () => this.trigger().nativeElement,
    () => this.list().nativeElement,
    () => this.close(),
    this.destroyRef,
  );

  /** Bumped whenever the native select may have changed: options, value, disabled. */
  private readonly version = signal(0);
  private readonly select = computed(() => this.control()?.element as HTMLSelectElement | undefined);

  protected readonly items = computed<PrimalListItem[]>(() => {
    this.version();
    const select = this.select();
    if (!select) return [];
    return toItems(
      [...select.options].map((o) => ({
        value: o.value,
        label: o.label,
        disabled: o.disabled,
        group: o.parentElement instanceof HTMLOptGroupElement ? o.parentElement.label : undefined,
      })),
      this.key,
    );
  });
  protected readonly selected = computed(() => (this.version(), this.select()?.selectedIndex ?? -1));
  protected readonly disabled = computed(() => (this.version(), !!this.select()?.matches(':disabled')));
  protected readonly required = computed(() => (this.version(), !!this.select()?.required));
  protected readonly shown = computed(() => this.items()[this.selected()]?.label ?? '');
  /** An empty value ("Choose a country") reads as a prompt, not an answer. */
  protected readonly placeholder = computed(() => this.items()[this.selected()]?.value === '');

  protected readonly active = signal(-1);
  protected readonly activeId = computed(() => this.items()[this.active()]?.id ?? null);

  private typed = '';
  private typedAt = 0;

  constructor() {
    afterNextRender(() => {
      const select = this.select();
      if (!select) return;
      this.hide(select);
      this.follow(select);
    });
    // A reset form puts the native select back; read it again once the browser has.
    effect(() => {
      if (!this.form?.resets()) return;
      untracked(() => setTimeout(() => this.refresh()));
    });
  }

  protected toggle(): void {
    if (this.popup.open()) this.close();
    else this.openAt(this.selected());
  }

  protected onKey(e: KeyboardEvent): void {
    const items = this.items();
    const open = this.popup.open();
    const move = (to: number) => {
      if (!open) this.openAt(to);
      else this.setActive(to);
    };
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (e.altKey || !open) return this.openAt(this.selected());
        return this.setActive(step(items, this.active(), 1));
      case 'ArrowUp':
        e.preventDefault();
        if (open && e.altKey) return this.commit();
        if (!open) return this.openAt(this.selected());
        return this.setActive(step(items, this.active(), -1));
      case 'Home':
        e.preventDefault();
        return move(firstEnabled(items));
      case 'End':
        e.preventDefault();
        return move(lastEnabled(items));
      case 'PageDown':
        if (!open) return;
        e.preventDefault();
        return this.setActive(step(items, this.active(), 10));
      case 'PageUp':
        if (!open) return;
        e.preventDefault();
        return this.setActive(step(items, this.active(), -10));
      case 'Enter':
      case ' ':
        if (e.key === ' ' && this.typed && Date.now() - this.typedAt < 500) return this.typeAhead(e);
        e.preventDefault();
        return open ? this.commit() : this.openAt(this.selected());
      case 'Escape':
        if (!open) return;
        e.preventDefault();
        return this.close();
      case 'Tab':
        if (open) this.commit();
        return;
      default:
        if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) this.typeAhead(e);
    }
  }

  protected onBlur(): void {
    this.close();
    const control = this.control();
    control?.touched.set(true);
    control?.check();
  }

  protected choose(item: PrimalListItem): void {
    if (item.disabled) return;
    this.write(item.index);
    this.close();
  }

  private commit(): void {
    const item = this.items()[this.active()];
    if (item && !item.disabled) this.write(item.index);
    this.close();
  }

  private openAt(index: number): void {
    if (this.disabled()) return;
    this.refresh();
    const items = this.items();
    this.active.set(items[index] && !items[index].disabled ? index : firstEnabled(items));
    this.popup.show();
    this.popup.reveal(this.activeId());
  }

  private close(): void {
    this.popup.hide();
    this.typed = '';
  }

  private setActive(index: number): void {
    this.active.set(index);
    this.popup.reveal(this.activeId());
  }

  /** Typing letters jumps to the next option that starts with them, as a native select does. */
  private typeAhead(e: KeyboardEvent): void {
    e.preventDefault();
    const now = Date.now();
    this.typed = now - this.typedAt < 500 ? this.typed + e.key : e.key;
    this.typedAt = now;
    const items = this.items();
    const from = this.popup.open() ? this.active() : this.selected();
    const query = fold(this.typed);
    const order = [...items.slice(from + (this.typed.length === 1 ? 1 : 0)), ...items.slice(0, from + 1)];
    const hit = order.find((i) => !i.disabled && fold(i.label).startsWith(query));
    if (!hit) return;
    if (this.popup.open()) this.setActive(hit.index);
    else this.write(hit.index);
  }

  /** Sets the native select and tells everyone listening (forms APIs, the field's message). */
  private write(index: number): void {
    const select = this.select();
    if (!select || select.selectedIndex === index) return this.refresh();
    select.selectedIndex = index;
    select.dispatchEvent(new Event('input', { bubbles: true }));
    select.dispatchEvent(new Event('change', { bubbles: true }));
    this.refresh();
  }

  private refresh(): void {
    this.version.update((n) => n + 1);
  }

  /** The native select stays in the form, out of sight and out of the tab order. */
  private hide(select: HTMLSelectElement): void {
    select.classList.add('pr-visually-hidden');
    select.tabIndex = -1;
    select.setAttribute('aria-hidden', 'true');
    // The label points at the native select; focus (from the label, or a failed submit) goes on to the button.
    select.addEventListener('focus', () => this.trigger().nativeElement.focus());
    const toTrigger = (e: Event) => {
      e.preventDefault();
      this.trigger().nativeElement.focus();
    };
    for (const label of select.labels ?? []) {
      label.addEventListener('click', toTrigger);
      this.destroyRef.onDestroy(() => label.removeEventListener('click', toTrigger));
    }
  }

  /** Follows the native select when code changes it: new options, a value set by a forms API, disabled. */
  private follow(select: HTMLSelectElement): void {
    const observer = new MutationObserver(() => {
      primalApplyWanted(select);
      this.refresh();
    });
    observer.observe(select, { childList: true, subtree: true, attributes: true, characterData: true });
    const fieldset = select.closest('fieldset');
    if (fieldset) observer.observe(fieldset, { attributes: true, attributeFilter: ['disabled'] });
    // primalControl watches the value from the start (select-value.ts); a value already waiting is applied now.
    if (primalApplyWanted(select)) this.refresh();
    select.addEventListener(PRIMAL_SELECT_SET, () => this.refresh());
    select.addEventListener('change', () => this.refresh());
    this.destroyRef.onDestroy(() => observer.disconnect());
  }
}
