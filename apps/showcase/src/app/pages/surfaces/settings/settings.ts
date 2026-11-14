import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  PRIMAL_ACTIONS,
  PRIMAL_CONTENT,
  PRIMAL_FEEDBACK,
  PRIMAL_FORMS,
  PrimalConfirm,
  PrimalPreferences,
  PrimalTheme,
} from '@mycelium-llc/primal-angular';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const SECTIONS = [
  { slug: 'profile', title: 'Profile' },
  { slug: 'notifications', title: 'Notifications' },
  { slug: 'appearance', title: 'Appearance' },
  { slug: 'account', title: 'Account' },
];

/** The settings surface: a section per address; switches save at once, forms on Save Changes. Nothing is saved anywhere (mock). */
@Component({
  selector: 'pr-surfaces-settings-page',
  imports: [PRIMAL_FORMS, PRIMAL_ACTIONS, PRIMAL_FEEDBACK, PRIMAL_CONTENT, RouterLink],
  templateUrl: './settings.html',
  styleUrls: ['../surfaces.css', '../../actions/actions-pages.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SurfacesSettingsPage {
  protected readonly prefs = inject(PrimalPreferences);
  private readonly confirm = inject(PrimalConfirm);

  /** From the address: the section shown. An unknown one shows the first. */
  readonly section = input<string>('profile');
  protected readonly sections = SECTIONS;
  protected readonly current = computed(() => SECTIONS.find((s) => s.slug === this.section()) ?? SECTIONS[0]);

  // MOCK DATA: the signed-in person's settings.
  protected readonly name = signal('Ada Shapiro');
  protected readonly draft = signal('Ada Shapiro');
  protected readonly saveProfile = async () => {
    if (!this.draft().trim()) return;
    await wait(500);
    this.name.set(this.draft().trim());
    return 'Saved';
  };

  protected readonly notifications = [
    { label: 'When a report is ready', description: 'Reports you made or follow.', on: true },
    { label: 'When someone comments', description: 'Only on reports you own.', on: false },
    { label: 'A weekly summary', description: 'Mondays at 09:00.', on: true },
  ];
  protected readonly savedNote = signal<string | null>(null);
  private noteTimer?: ReturnType<typeof setTimeout>;
  /** A switch saves the moment it changes, and says so beside itself for two seconds. */
  protected toggled(label: string): void {
    clearTimeout(this.noteTimer);
    this.savedNote.set(label);
    this.noteTimer = setTimeout(() => this.savedNote.set(null), 2000);
  }

  protected readonly themes: { value: PrimalTheme; label: string; description: string }[] = [
    { value: 'system', label: 'Follow the system', description: 'Light by day, dark by night, as your device says.' },
    { value: 'light', label: 'Light', description: 'Ink on white, always.' },
    { value: 'dark', label: 'Dark', description: 'White on ink, always.' },
  ];

  protected readonly deleted = signal(false);
  protected async deleteAccount(): Promise<void> {
    const yes = await this.confirm.ask({
      title: 'Delete your account for good?',
      body: 'Your reports, comments and settings go with it. This can’t be undone.',
      confirm: 'Delete Account',
      cancel: 'Keep Account',
      kind: 'destructive',
    });
    if (yes) this.deleted.set(true);
  }
}
