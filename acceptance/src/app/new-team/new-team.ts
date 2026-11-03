import { Component, computed, effect, inject, input, signal, untracked } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { PRIMAL_ACTIONS, PRIMAL_CONTENT, PRIMAL_FEEDBACK, PRIMAL_FORMS } from '@mycelium-llc/primal-angular';
import { Team } from '../data';
import { Workspace } from '../workspace';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const STEPS = [
  { key: 'team', title: 'Team' },
  { key: 'people', title: 'People' },
  { key: 'review', title: 'Review' },
] as const;
type Step = (typeof STEPS)[number]['key'];

/**
 * New Team, in three steps: the step is in the address (?step=people), so Back goes to the one
 * before; answers are kept across steps; the last step shows everything once more, with Change.
 */
@Component({
  selector: 'app-new-team',
  imports: [RouterLink, PRIMAL_FORMS, PRIMAL_ACTIONS, PRIMAL_FEEDBACK, PRIMAL_CONTENT],
  templateUrl: './new-team.html',
})
export class NewTeam {
  private readonly router = inject(Router);
  protected readonly workspace = inject(Workspace);

  /** From the address. A step whose earlier steps aren't answered goes back to the first. */
  readonly stepParam = input<string>(undefined, { alias: 'step' });
  protected readonly steps = STEPS;
  protected readonly step = computed<Step>(() => {
    const s = STEPS.find((x) => x.key === this.stepParam())?.key ?? 'team';
    return s !== 'team' && !this.name().trim() ? 'team' : s;
  });
  protected readonly at = computed(() => STEPS.findIndex((s) => s.key === this.step()));

  // The answers, kept while the person moves between steps.
  protected readonly name = signal('');
  protected readonly purpose = signal('');
  protected readonly members = signal<string[]>([]);
  protected readonly memberNames = computed(() =>
    this.workspace.people.filter((p) => this.members().includes(p.email)).map((p) => p.name),
  );
  protected readonly created = signal<Team | null>(null);

  constructor() {
    // A step that can't be shown yet sends the address back too, once the router is idle.
    effect(() => {
      const shown = this.step();
      const asked = this.stepParam();
      const busy = this.router.currentNavigation();
      if (!busy && asked && asked !== shown && !this.created()) {
        untracked(() => void this.router.navigate([], { queryParams: { step: shown }, replaceUrl: true }));
      }
    });
  }

  protected go(step: Step): void {
    void this.router.navigate([], { queryParams: { step } });
  }

  protected toggleMember(email: string, on: boolean): void {
    this.members.update((all) => (on ? [...new Set([...all, email])] : all.filter((e) => e !== email)));
  }

  protected readonly create = async () => {
    await wait(600);
    this.created.set(this.workspace.createTeam({ name: this.name().trim(), purpose: this.purpose().trim(), members: this.members() }));
  };

  protected startAgain(): void {
    this.created.set(null);
    this.name.set('');
    this.purpose.set('');
    this.members.set([]);
    this.go('team');
  }
}
