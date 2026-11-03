import { InjectionToken } from '@angular/core';

/** A native control Primal can validate: its own constraint validation is the source of truth. */
export type PrimalNativeControl = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

/**
 * Turns a control's validity into a message that says what to do, in the person's words.
 * The label is the field's own, so the message names what is being asked for.
 */
export type PrimalMessages = (control: PrimalNativeControl, label: string) => string | null;

const lower = (label: string) => label.charAt(0).toLowerCase() + label.slice(1);

/**
 * "Name" becomes "a name" when it is missing and "the name" after that, so a message fits a field
 * about anything: a person, a project, a note. A label that already says whose it is stays as it is.
 */
const owned = (label: string) => /^(your|the|a|an|my|our) /i.test(label);
const some = (label: string) => (owned(label) ? lower(label) : `${/^[aeiou]/i.test(label) ? 'an' : 'a'} ${lower(label)}`);
const the = (label: string) => (owned(label) ? lower(label) : `the ${lower(label)}`);

/** Primal's English messages: what happened, and what to type. */
export const primalEnglishMessages: PrimalMessages = (el, label) => {
  const v = el.validity;
  if (v.valid) return null;
  const type = el instanceof HTMLInputElement ? el.type : el.tagName.toLowerCase();
  const input = el instanceof HTMLInputElement ? el : null;
  if (v.valueMissing) {
    if (type === 'checkbox') return 'Check this box to continue.';
    if (type === 'radio') return 'Choose one of the options.';
    if (type === 'select' || type === 'file' || type === 'color') return `Choose ${some(label)}.`;
    return `Enter ${some(label)}.`;
  }
  if (v.badInput) return type === 'number' ? 'Enter a number, using digits only.' : `Enter ${the(label)} in full.`;
  if (v.typeMismatch) {
    if (type === 'email') return 'Enter an email address like name@example.com.';
    if (type === 'url') return 'Enter a web address that starts with https://.';
  }
  if (v.tooShort && input) return `Use at least ${input.minLength} characters. You've used ${input.value.length}.`;
  if (v.tooLong && input) return `Use at most ${input.maxLength} characters.`;
  if (v.rangeUnderflow && input) return `Enter ${input.min} or more.`;
  if (v.rangeOverflow && input) return `Enter ${input.max} or less.`;
  if (v.stepMismatch && input) return input.step === '1' || !input.step ? 'Enter a whole number.' : `Use steps of ${input.step}.`;
  if (v.patternMismatch) return el.title || `Enter ${the(label)} in the format shown.`;
  if (v.customError) return el.validationMessage;
  return `Check ${the(label)}.`;
};

/** Provide your own messages (another language, another voice): { provide: PRIMAL_MESSAGES, useValue: fn }. */
export const PRIMAL_MESSAGES = new InjectionToken<PrimalMessages>('PRIMAL_MESSAGES', {
  providedIn: 'root',
  factory: () => primalEnglishMessages,
});
