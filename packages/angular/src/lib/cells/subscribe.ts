import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { PrimalButton } from '../actions/button';
import { PrimalAlert } from '../feedback/alert';
import { PrimalControl } from '../forms/control';
import { PrimalField } from '../forms/field';
import { PrimalMask } from '../forms/mask';

/**
 * A cell: subscribing to a newsletter, end to end. Its payload is the promise (what arrives, how
 * often). Its job ends in a subscription said in place, naming the address, or in an error under
 * the field that says what to do; nothing is left to the page around it.
 *
 *   <primal-subscribe title="Get the Primal newsletter" promise="One email per release." [subscribe]="subscribe" />
 *
 * `subscribe(email)` does the work: resolve when it's done, throw an Error whose message says
 * what to do ("That address bounced last time. Check it, or use another.") when it isn't.
 */
@Component({
  selector: 'primal-subscribe',
  imports: [PrimalButton, PrimalAlert, PrimalControl, PrimalField, PrimalMask],
  host: { class: 'pr-subscribe' },
  template: `
    <h3>{{ title() }}</h3>
    <p>{{ promise() }}</p>
    @if (subscribed(); as email) {
      <primal-alert tone="success" [title]="doneTitle()" [live]="true">
        <p>{{ doneText().replace('{email}', email) }}</p>
        <div class="pr-alert-actions">
          <button primalButton type="button" emphasis="quiet" (click)="subscribed.set(null)">{{ anotherLabel() }}</button>
        </div>
      </primal-alert>
    } @else {
      <form class="pr-inline pr-subscribe-form" data-gap="component" (submit)="$event.preventDefault()" novalidate>
        <primal-field [label]="fieldLabel()" [optional]="false">
          <input #email [primalControl]="error()" primalMask="email" type="email" name="email" autocomplete="email" required (input)="error.set(null)" />
        </primal-field>
        <button primalButton type="submit" emphasis="primary" kind="constructive" [run]="send(email)">{{ actionLabel() }}</button>
      </form>
    }
  `,
  styles: `
    /* The button lines up with the field's box, under its label, and stays there when a message appears below. */
    .pr-subscribe-form {
      align-items: start;
    }

    .pr-subscribe-form > primal-field {
      flex: 1 1 var(--pr-field-width);
      max-inline-size: var(--pr-field-width);
      margin-block-end: 0;
    }

    .pr-subscribe-form > button {
      margin-block-start: calc(var(--pr-text-body) * var(--pr-leading-body) + var(--pr-gap-component) / 1.5);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrimalSubscribe {
  readonly title = input.required<string>();
  /** The payload: what the person gets, and how often. */
  readonly promise = input.required<string>();
  readonly subscribe = input.required<(email: string) => Promise<void>>();
  readonly fieldLabel = input('Email');
  readonly actionLabel = input('Subscribe to Newsletter');
  readonly doneTitle = input('You’re subscribed');
  /** {email} is the address they gave. */
  readonly doneText = input('The next email goes to {email}. Every one has a link to stop them.');
  readonly anotherLabel = input('Use Another Address');

  protected readonly error = signal<string | null>(null);
  protected readonly subscribed = signal<string | null>(null);

  protected send(field: HTMLInputElement) {
    return async () => {
      const email = field.value.trim();
      if (!field.checkValidity()) {
        this.error.set(field.value ? 'Enter an email address like name@example.com.' : 'Enter your email.');
        field.focus();
        return;
      }
      try {
        await this.subscribe()(email);
        this.subscribed.set(email);
      } catch (e) {
        this.error.set(e instanceof Error ? e.message : 'That didn’t go through. Try again in a moment.');
        field.focus();
      }
    };
  }
}
