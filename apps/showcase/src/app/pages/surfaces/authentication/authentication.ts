import { ChangeDetectionStrategy, Component, effect, input, signal, untracked } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PRIMAL_ACTIONS, PRIMAL_FEEDBACK, PRIMAL_FORMS } from '@mycelium-llc/primal-angular';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** The authentication surface: sign-in, sign-up and reset, each at its own address. Nothing is sent anywhere (mock). */
@Component({
  selector: 'pr-surfaces-authentication-page',
  imports: [PRIMAL_FORMS, PRIMAL_ACTIONS, PRIMAL_FEEDBACK, RouterLink],
  templateUrl: './authentication.html',
  styleUrls: ['../surfaces.css', '../../actions/actions-pages.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SurfacesAuthenticationPage {
  /** From the address: sign-in, sign-up or reset. */
  readonly mode = input<string>('sign-in');

  protected readonly showPassword = signal(false);
  protected readonly mismatch = signal(false);
  protected readonly signedIn = signal<string | null>(null);
  protected readonly sent = signal<string | null>(null);
  /** The email typed at sign-in, carried to the reset so it isn't typed twice. */
  protected readonly remembered = signal('');

  constructor() {
    // Each place starts fresh when the address changes; the remembered email stays.
    effect(() => {
      this.mode();
      untracked(() => {
        this.sent.set(null);
        this.mismatch.set(false);
      });
    });
  }

  protected signIn(email: HTMLInputElement, password: HTMLInputElement) {
    return async () => {
      this.mismatch.set(false);
      if (!email.form?.checkValidity()) return;
      await wait(600);
      // The one account the demo knows (mock).
      if (email.value === 'ada@example.com' && password.value === 'correct horse') this.signedIn.set(email.value);
      else {
        this.mismatch.set(true);
        password.value = '';
        password.focus();
      }
    };
  }

  protected signUp(email: HTMLInputElement) {
    return async () => {
      if (!email.form?.checkValidity()) return;
      await wait(700);
      this.sent.set(email.value);
    };
  }

  protected reset(email: HTMLInputElement) {
    return async () => {
      if (!email.form?.checkValidity()) return;
      await wait(600);
      this.sent.set(email.value);
    };
  }
}
