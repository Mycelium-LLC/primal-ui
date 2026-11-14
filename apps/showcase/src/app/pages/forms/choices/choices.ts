import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { PRIMAL_FORMS, PRIMAL_TABLES } from '@mycelium-llc/primal-angular';
import { PlainHtml } from '../../../shell/plain-html/plain-html';

@Component({
  selector: 'pr-forms-choices-page',
  imports: [PRIMAL_TABLES, PRIMAL_FORMS, PlainHtml],
  templateUrl: './choices.html',
  styleUrl: './choices.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormsChoicesPage {
  // Sample columns for the export example (mock data).
  protected readonly columns = [{ name: 'Name' }, { name: 'Email' }, { name: 'Last seen' }];
  protected readonly chosen = signal(new Set(['Name']));
  protected readonly allColumns = computed(() => this.chosen().size === this.columns.length);
  protected readonly someColumns = computed(() => this.chosen().size > 0 && !this.allColumns());

  protected setAll(on: boolean): void {
    this.chosen.set(new Set(on ? this.columns.map((c) => c.name) : []));
  }

  protected toggle(name: string, on: boolean): void {
    this.chosen.update((s) => {
      const next = new Set(s);
      if (on) next.add(name);
      else next.delete(name);
      return next;
    });
  }

  protected readonly plain = `<fieldset class="pr-group" aria-describedby="plan-message">
  <legend>Plan</legend>
  <div class="pr-choice">
    <input id="plan-free" type="radio" name="plan" value="free" required />
    <label for="plan-free">Free</label>
  </div>
  <div class="pr-choice">
    <input id="plan-team" type="radio" name="plan" value="team" />
    <label for="plan-team">Team</label>
    <p class="pr-field-description">Up to 20 people.</p>
  </div>
  <p class="pr-field-message" id="plan-message" aria-live="polite"></p>
</fieldset>

<div class="pr-choice">
  <input id="digest" type="checkbox" role="switch" checked />
  <label for="digest">Email me a weekly summary</label>
</div>`;
}
