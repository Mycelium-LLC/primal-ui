import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal, untracked } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { PRIMAL_ACTIONS, PRIMAL_CONTENT, PRIMAL_FEEDBACK, PRIMAL_FORMS } from '@mycelium-llc/primal-angular';
import { slugify } from '../reports';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const STEPS = [
  { key: 'workspace', title: 'Workspace' },
  { key: 'team', title: 'Team' },
  { key: 'review', title: 'Review' },
] as const;
type Step = (typeof STEPS)[number]['key'];

/** The multi-step surface: the step in the address, answers kept across steps, a review with Change. Nothing is made anywhere (mock). */
@Component({
  selector: 'pr-surfaces-multi-step-form-page',
  imports: [PRIMAL_FORMS, PRIMAL_ACTIONS, PRIMAL_FEEDBACK, PRIMAL_CONTENT, RouterLink],
  templateUrl: './multi-step-form.html',
  styleUrls: ['../surfaces.css', '../../actions/actions-pages.css'],
  styles: `
    .pr-steps-surface form {
      display: grid;
      gap: var(--pr-gap-group);
      max-inline-size: var(--pr-measure);
    }

    .pr-steps-surface form > * {
      margin: 0;
    }

    .pr-steps-surface .pr-actions {
      margin-block-start: var(--pr-gap-group);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SurfacesMultiStepFormPage {
  private readonly router = inject(Router);

  /** From the address (?step=team). A step whose earlier steps aren't answered goes back to the first. */
  readonly stepParam = input<string>(undefined, { alias: 'step' });
  protected readonly steps = STEPS;
  protected readonly step = computed<Step>(() => {
    const s = STEPS.find((x) => x.key === this.stepParam())?.key ?? 'workspace';
    return s !== 'workspace' && !this.workspace() ? 'workspace' : s;
  });
  protected readonly at = computed(() => STEPS.findIndex((s) => s.key === this.step()));

  // The answers, kept while the person moves between steps.
  protected readonly workspace = signal('');
  protected readonly address = signal('');
  private addressTouched = false;
  protected readonly invites = signal<string[]>([]);
  protected readonly created = signal(false);

  constructor() {
    // A step that can't be shown yet sends the address back too, so the form never jumps ahead
    // while the person is still typing an earlier step.
    // It waits until the router is idle: a navigation started mid-navigation is lost.
    effect(() => {
      const shown = this.step();
      const asked = this.stepParam();
      const busy = this.router.currentNavigation();
      if (!busy && asked && asked !== shown) untracked(() => void this.router.navigate([], { queryParams: { step: shown }, replaceUrl: true }));
    });
  }

  protected setWorkspace(name: string): void {
    this.workspace.set(name);
    // The address follows the name until the person writes their own.
    if (!this.addressTouched) this.address.set(slugify(name));
  }

  protected setAddress(address: string): void {
    this.addressTouched = true;
    this.address.set(address);
  }

  protected go(step: Step): void {
    void this.router.navigate([], { queryParams: { step } });
  }

  protected addInvite(field: HTMLInputElement): void {
    const email = field.value.trim();
    if (!email || !field.checkValidity()) return;
    if (!this.invites().includes(email)) this.invites.update((list) => [...list, email]);
    field.value = '';
    field.focus();
  }

  protected removeInvite(email: string): void {
    this.invites.update((list) => list.filter((e) => e !== email));
  }

  protected readonly create = async () => {
    await wait(800);
    this.created.set(true);
  };

  protected startAgain(): void {
    this.created.set(false);
    this.workspace.set('');
    this.address.set('');
    this.invites.set([]);
    this.addressTouched = false;
    this.go('workspace');
  }
}
