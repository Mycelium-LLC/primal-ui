import { Component, computed, inject, input, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  PRIMAL_ACTIONS,
  PRIMAL_CONTENT,
  PRIMAL_FEEDBACK,
  PRIMAL_FORMS,
  PrimalConfirm,
  PrimalDirection,
  PrimalPreferences,
  PrimalTheme,
  PrimalToaster,
} from '@mycelium-llc/primal-angular';
import { Auth } from '../auth/auth';
import { Digest, NotificationSettings } from './notification-settings';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const SECTIONS = [
  { slug: 'profile', title: 'Profile' },
  { slug: 'notifications', title: 'Notifications' },
  { slug: 'appearance', title: 'Appearance' },
  { slug: 'account', title: 'Account' },
];

/**
 * Settings: each section at its own address (/settings/<section>). A choice saves the moment it
 * changes and says so beside itself; the profile form saves on Save Changes; deleting the account
 * sits last, apart, behind a confirmation.
 */
@Component({
  selector: 'app-settings',
  imports: [RouterLink, PRIMAL_FORMS, PRIMAL_ACTIONS, PRIMAL_FEEDBACK, PRIMAL_CONTENT],
  templateUrl: './settings.html',
})
export class Settings {
  protected readonly auth = inject(Auth);
  protected readonly prefs = inject(PrimalPreferences);
  protected readonly notifications = inject(NotificationSettings);
  private readonly confirm = inject(PrimalConfirm);
  private readonly toaster = inject(PrimalToaster);
  private readonly router = inject(Router);

  /** From the address. None: on a phone the list of sections shows; at a desk, the first section beside it. */
  readonly section = input<string>();
  protected readonly sections = SECTIONS;
  protected readonly current = computed(() => SECTIONS.find((s) => s.slug === this.section()) ?? SECTIONS[0]);

  // Profile: saved on Save Changes.
  protected readonly bio = signal('Counts birds on weekends.');
  protected saveProfile(form: HTMLFormElement) {
    return async () => {
      if (!form.checkValidity()) return;
      const data = new FormData(form);
      await wait(500);
      this.auth.update({ name: String(data.get('name')).trim(), email: String(data.get('email')).trim() });
      this.bio.set(String(data.get('bio') ?? '').trim());
      return 'Saved';
    };
  }

  // Notifications and appearance: saved the moment they change, and said so beside the choice for two seconds.
  protected readonly savedNote = signal<string | null>(null);
  private noteTimer?: ReturnType<typeof setTimeout>;
  private saved(key: string): void {
    clearTimeout(this.noteTimer);
    this.savedNote.set(key);
    this.noteTimer = setTimeout(() => this.savedNote.set(null), 2000);
  }

  protected toggle(key: string, on: boolean): void {
    this.notifications.set(key, on);
    this.saved(key);
  }

  protected readonly digests: { value: Digest; label: string; description: string }[] = [
    { value: 'daily', label: 'Daily', description: 'Every morning at 08:00.' },
    { value: 'weekly', label: 'Weekly', description: 'Mondays at 08:00.' },
    { value: 'never', label: 'Never', description: 'Only the notifications above.' },
  ];
  protected chooseDigest(value: Digest): void {
    this.notifications.digest.set(value);
    this.saved('digest');
  }

  protected readonly themes: { value: PrimalTheme; label: string; description: string }[] = [
    { value: 'system', label: 'Follow the system', description: 'Light or dark, as your device says.' },
    { value: 'light', label: 'Light', description: 'Ink on white, always.' },
    { value: 'dark', label: 'Dark', description: 'White on ink, always.' },
  ];
  protected chooseTheme(value: PrimalTheme): void {
    this.prefs.theme.set(value);
    this.saved('theme');
  }

  protected readonly directions: { value: PrimalDirection; label: string; description: string }[] = [
    { value: 'ltr', label: 'Left to right', description: 'English, Spanish, most languages.' },
    { value: 'rtl', label: 'Right to left', description: 'Hebrew, Arabic, Persian.' },
  ];
  protected chooseDirection(value: PrimalDirection): void {
    this.prefs.direction.set(value);
    this.saved('direction');
  }

  // Account: deleting it can't be undone, so it is asked once.
  protected async deleteAccount(): Promise<void> {
    const yes = await this.confirm.ask({
      title: 'Delete your account for good?',
      body: 'Your profile and settings go with it. Projects and notes you wrote stay with the team. This can’t be undone.',
      confirm: 'Delete Account',
      cancel: 'Keep Account',
      kind: 'destructive',
    });
    if (!yes) return;
    this.auth.deleteAccount();
    await this.router.navigateByUrl('/sign-up');
    this.toaster.show('Deleted your account.');
  }
}
