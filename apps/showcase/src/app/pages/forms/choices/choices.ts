import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PRIMAL_FORMS } from 'primal-angular';
import { PlainHtml } from '../../../shell/plain-html/plain-html';

@Component({
  selector: 'pr-forms-choices-page',
  imports: [PRIMAL_FORMS, PlainHtml],
  templateUrl: './choices.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormsChoicesPage {
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
