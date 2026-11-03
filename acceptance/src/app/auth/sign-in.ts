import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { PRIMAL_ACTIONS, PRIMAL_FORMS } from '@mycelium-llc/primal-angular';
import { Auth } from './auth';

/** Sign in: any valid email and password gets in (mock), then lands where the visitor was going. */
@Component({
  selector: 'app-sign-in',
  imports: [PRIMAL_FORMS, PRIMAL_ACTIONS, RouterLink],
  template: `
    <main class="pr-container">
      <div class="pr-auth">
        <p class="pr-auth-brand">Field Notes</p>
        <h1>Sign in</h1>
        <form primalForm>
          <primal-field label="Email">
            <input #email primalControl type="email" name="email" autocomplete="username" required
              [value]="auth.rememberedEmail()" (input)="auth.rememberedEmail.set(email.value)" />
          </primal-field>
          <primal-field label="Password">
            <input primalControl [type]="showPassword() ? 'text' : 'password'" name="password" autocomplete="current-password" required />
          </primal-field>
          <div class="pr-inline" data-gap="component">
            <primal-field label="Show password">
              <input primalControl type="checkbox" [checked]="showPassword()" (change)="showPassword.set(!showPassword())" />
            </primal-field>
            <a class="pr-push" routerLink="/reset">Forgot your password?</a>
          </div>
          <button primalButton type="submit" emphasis="primary" [run]="signIn(email)">Sign In</button>
        </form>
        <p class="pr-auth-switch">New here? <a routerLink="/sign-up">Create an account</a></p>
      </div>
    </main>
  `,
})
export class SignIn {
  protected readonly auth = inject(Auth);
  private readonly router = inject(Router);
  protected readonly showPassword = signal(false);

  protected signIn(email: HTMLInputElement) {
    return async () => {
      // The form shows what is missing; the work runs only for a complete answer.
      if (!email.form?.checkValidity()) return;
      await this.auth.signIn(email.value.trim());
      await this.router.navigateByUrl(this.auth.returnTo);
    };
  }
}
