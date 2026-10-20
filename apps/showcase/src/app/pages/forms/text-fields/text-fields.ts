import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PRIMAL_FORMS } from 'primal-angular';
import { PlainHtml } from '../../../shell/plain-html/plain-html';

@Component({
  selector: 'pr-forms-text-fields-page',
  imports: [PRIMAL_FORMS, PlainHtml],
  templateUrl: './text-fields.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormsTextFieldsPage {
  protected readonly plain = `<div class="pr-field">
  <label for="email">Email</label>
  <p class="pr-field-description" id="email-hint">We only use it to send receipts.</p>
  <input id="email" type="email" autocomplete="email" required
         aria-describedby="email-hint email-message" />
  <p class="pr-field-message" id="email-message" aria-live="polite"></p>
</div>`;

  protected readonly angular = `<primal-field label="Email" description="We only use it to send receipts.">
  <input primalControl type="email" autocomplete="email" required />
</primal-field>`;
}
