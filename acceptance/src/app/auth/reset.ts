import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PRIMAL_ACTIONS, PRIMAL_FORMS } from '@mycelium-llc/primal-angular';
import { Auth } from './auth';

/** Reset: asks for the email only, and never says whether an account uses it (mock: nothing is sent). */
@Component({
  selector: 'app-reset',
  imports: [PRIMAL_FORMS, PRIMAL_ACTIONS, RouterLink],
  template: `
    <main class="pr-container">
      <div class="pr-auth">
        <p class="pr-auth-brand">Field Notes</p>
        @if (sent(); as address) {
          <h1>Check your inbox</h1>
          <p>If an account uses <strong>{{ address }}</strong>, a link to set a new password is on its way. It works for an hour.</p>
          <button primalButton type="button" emphasis="quiet" (click)="sent.set(null)">Use Another Address</button>
        } @else {
          <h1>Reset your password</h1>
          <p>Enter the email you sign in with, and we'll send a link to set a new password.</p>
          <form primalForm>
            <primal-field label="Email">
              <input #email primalControl type="email" name="email" autocomplete="username" required
                [value]="auth.rememberedEmail()" (input)="auth.rememberedEmail.set(email.value)" />
            </primal-field>
            <button primalButton type="submit" emphasis="primary" [run]="send(email)">Send Reset Link</button>
          </form>
        }
        <p class="pr-auth-switch"><a routerLink="/sign-in">Back to sign in</a></p>
      </div>
    </main>
  `,
})
export class Reset {
  protected readonly auth = inject(Auth);
  protected readonly sent = signal<string | null>(null);

  protected send(email: HTMLInputElement) {
    return async () => {
      if (!email.form?.checkValidity()) return;
      await this.auth.sendReset();
      this.sent.set(email.value.trim());
    };
  }
}
