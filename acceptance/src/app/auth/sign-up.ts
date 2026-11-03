import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { PRIMAL_ACTIONS, PRIMAL_FORMS } from '@mycelium-llc/primal-angular';
import { Auth } from './auth';

/** Sign up: three questions, and the new account is signed in at once (mock). */
@Component({
  selector: 'app-sign-up',
  imports: [PRIMAL_FORMS, PRIMAL_ACTIONS, RouterLink],
  template: `
    <main class="pr-container">
      <div class="pr-auth">
        <p class="pr-auth-brand">Field Notes</p>
        <h1>Create your account</h1>
        <form primalForm>
          <primal-field label="Your name">
            <input #name primalControl name="name" autocomplete="name" required maxlength="80" />
          </primal-field>
          <primal-field label="Email">
            <input #email primalControl type="email" name="email" autocomplete="email" required [value]="auth.rememberedEmail()" />
          </primal-field>
          <primal-field label="Password" description="At least 12 characters. A sentence works well.">
            <input primalControl type="password" name="password" autocomplete="new-password" minlength="12" required />
          </primal-field>
          <button primalButton type="submit" emphasis="primary" kind="constructive" [run]="signUp(name, email)">Create Account</button>
        </form>
        <p class="pr-auth-switch">Have an account? <a routerLink="/sign-in">Sign in</a></p>
      </div>
    </main>
  `,
})
export class SignUp {
  protected readonly auth = inject(Auth);
  private readonly router = inject(Router);

  protected signUp(name: HTMLInputElement, email: HTMLInputElement) {
    return async () => {
      if (!email.form?.checkValidity()) return;
      await this.auth.signUp(name.value.trim(), email.value.trim());
      await this.router.navigateByUrl('/projects');
    };
  }
}
