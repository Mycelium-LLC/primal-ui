import { Service, inject, signal } from '@angular/core';
import { CanMatchFn, RedirectCommand, Router } from '@angular/router';

export interface Account {
  readonly name: string;
  readonly email: string;
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Fake authentication (mock): any valid email and password signs in, and the account lives in
 * memory until the page reloads. Nothing is sent anywhere.
 */
@Service()
export class Auth {
  readonly account = signal<Account | null>(null);
  /** The email typed at sign-in, carried to the reset so it isn't typed twice. */
  readonly rememberedEmail = signal('');
  /** Where a signed-out visitor was going, so signing in lands there. */
  returnTo = '/projects';

  /** Accounts made in this visit (mock), so a returning name is kept. */
  private readonly known = new Map<string, string>([['ada@example.com', 'Ada Shapiro']]);

  async signIn(email: string): Promise<void> {
    await wait(500);
    const name = this.known.get(email) ?? nameFrom(email);
    this.account.set({ name, email });
  }

  async signUp(name: string, email: string): Promise<void> {
    await wait(600);
    this.known.set(email, name);
    this.account.set({ name, email });
  }

  async sendReset(): Promise<void> {
    await wait(500);
  }

  update(account: Account): void {
    this.known.set(account.email, account.name);
    this.account.set(account);
  }

  signOut(): void {
    this.account.set(null);
    this.returnTo = '/projects';
  }

  deleteAccount(): void {
    const email = this.account()?.email;
    if (email) this.known.delete(email);
    this.rememberedEmail.set('');
    this.signOut();
  }
}

/** "carmen.ruiz@example.com" reads as "Carmen Ruiz" until the person says otherwise. */
function nameFrom(email: string): string {
  return email
    .split('@')[0]
    .split(/[._-]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

/** The product's places need an account; a signed-out visitor goes to sign in, and comes back after. */
export const signedIn: CanMatchFn = () => {
  const auth = inject(Auth);
  if (auth.account()) return true;
  const router = inject(Router);
  const going = router.currentNavigation()?.extractedUrl.toString();
  if (going && going !== '/') auth.returnTo = going;
  return new RedirectCommand(router.parseUrl('/sign-in'));
};

/** The gate's places are for signed-out visitors; a signed-in one goes to the projects. */
export const signedOut: CanMatchFn = () => {
  if (!inject(Auth).account()) return true;
  return new RedirectCommand(inject(Router).parseUrl('/projects'));
};
