import { DestroyRef, Directive, ElementRef, afterNextRender, inject, input } from '@angular/core';

/**
 * 'phone', 'email' and 'url' are ready-made; any other string is a pattern, where 0 is a digit,
 * a is a letter, * is a letter or digit, and anything else is written in for the person.
 */
export type PrimalMaskKind = 'phone' | 'email' | 'url' | (string & {});

const SCHEME = 'https://';
const INPUTMODE: Record<string, string> = { phone: 'tel', email: 'email', url: 'url' };

/**
 * Shapes what is typed as it is typed, so the answer is in the form it is asked for, and the
 * caret stays where the person is typing. The control stays native: autofill and pasting work,
 * and a pasted answer is shaped too.
 *
 *   <input primalControl primalMask="phone" type="tel" />                     050-123-4567
 *   <input primalControl primalMask="(000) 000-0000" type="tel" />            (555) 123-4567
 *   <input primalControl primalMask="email" type="email" />                   no spaces, one @, the domain in lower case
 *   <input primalControl primalMask="url" type="url" />                       https:// written in, no spaces
 */
@Directive({ selector: 'input[primalMask]' })
export class PrimalMask {
  private readonly el = inject<ElementRef<HTMLInputElement>>(ElementRef).nativeElement;

  readonly primalMask = input.required<PrimalMaskKind>();
  /** The pattern the 'phone' mask writes to. */
  readonly phonePattern = input('000-000-0000');

  private shaping = false;

  constructor() {
    afterNextRender(() => {
      const mode = INPUTMODE[this.primalMask()];
      if (mode && !this.el.hasAttribute('inputmode')) this.el.setAttribute('inputmode', mode);
      if (this.el.value) this.shape(false);
    });
    const onInput = (e: Event) => {
      if (this.shaping) return;
      // Deleting runs backwards through what the mask wrote in, rather than being undone by it.
      const deleting = (e as InputEvent).inputType?.startsWith('delete') ?? false;
      this.shape(deleting);
    };
    const onFocus = () => {
      if (this.primalMask() === 'url' && !this.el.value && !this.el.readOnly) this.write(SCHEME, SCHEME.length);
    };
    const onBlur = () => {
      if (this.primalMask() === 'url' && this.el.value === SCHEME) this.write('', 0);
    };
    this.el.addEventListener('input', onInput);
    this.el.addEventListener('focus', onFocus);
    this.el.addEventListener('blur', onBlur);
    inject(DestroyRef).onDestroy(() => {
      this.el.removeEventListener('input', onInput);
      this.el.removeEventListener('focus', onFocus);
      this.el.removeEventListener('blur', onBlur);
    });
  }

  private shape(deleting: boolean): void {
    const kind = this.primalMask();
    const value = this.el.value;
    const caret = this.el.selectionStart ?? value.length;

    if (kind === 'email') {
      const at = value.indexOf('@');
      const local = (at < 0 ? value : value.slice(0, at)).replace(/\s/g, '');
      const domain = at < 0 ? null : value.slice(at + 1).replace(/[\s@]/g, '').toLowerCase();
      const next = domain === null ? local : `${local}@${domain}`;
      return this.write(next, Math.max(0, caret - (value.length - next.length)));
    }

    if (kind === 'url') {
      let rest = value.replace(/\s/g, '');
      if (!rest) return this.write('', 0);
      // Pasting a whole address after the written-in scheme keeps just the one.
      rest = rest.replace(/^(https?:\/\/)+(?=https?:\/\/)/i, '');
      const scheme = /^https?:\/\//i.exec(rest)?.[0].toLowerCase() ?? SCHEME;
      const body = rest.replace(/^https?:\/\//i, '');
      const slash = body.indexOf('/');
      const host = (slash < 0 ? body : body.slice(0, slash)).toLowerCase();
      const next = scheme + host + (slash < 0 ? '' : body.slice(slash));
      return this.write(next, Math.max(scheme.length, caret + (next.length - value.length)));
    }

    const pattern = kind === 'phone' ? this.phonePattern() : kind;
    // A phone number may start with + (an international number): it keeps its own grouping.
    if (kind === 'phone' && value.trimStart().startsWith('+')) {
      const digits = value.replace(/\D/g, '');
      const next = `+${digits}`;
      return this.write(next, Math.min(next.length, caret + (next.length - value.length)));
    }
    const slots = (c: string) => c === '0' || c === 'a' || c === '*';
    const fits = (slot: string, c: string) => (slot === '0' ? /\d/.test(c) : slot === 'a' ? /\p{L}/u.test(c) : /[\p{L}\d]/u.test(c));
    // What the person typed that the pattern can take; what the mask wrote in is not counted.
    const takes = pattern.includes('a') || pattern.includes('*') ? /[\p{L}\d]/u : /\d/;
    const typed = [...value].filter((c) => takes.test(c));
    const typedBeforeCaret = [...value.slice(0, caret)].filter((c) => takes.test(c)).length;
    let out = '';
    let used = 0;
    let caretAt = 0;
    for (const p of pattern) {
      if (used >= typed.length || (slots(p) && !fits(p, typed[used]))) break;
      if (slots(p)) {
        out += typed[used++];
        if (used === typedBeforeCaret) caretAt = out.length;
      } else {
        out += p;
      }
    }
    if (typedBeforeCaret === 0) caretAt = 0;
    // When deleting, the separators the mask wrote after the last digit go too.
    if (deleting) out = out.replace(/[^\p{L}\d]+$/u, '');
    this.write(out, Math.min(caretAt || out.length, out.length));
  }

  private write(next: string, caret: number): void {
    if (next === this.el.value) return;
    this.el.value = next;
    if (this.el.ownerDocument.activeElement === this.el) this.el.setSelectionRange(caret, caret);
    // Tell forms libraries about the shaped value.
    this.shaping = true;
    this.el.dispatchEvent(new Event('input', { bubbles: true }));
    this.shaping = false;
  }
}
