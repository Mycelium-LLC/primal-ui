import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PRIMAL_FORMS } from 'primal-angular';
import { PlainHtml } from '../../../shell/plain-html/plain-html';

@Component({
  selector: 'pr-forms-select-page',
  imports: [PRIMAL_FORMS, PlainHtml],
  templateUrl: './select.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormsSelectPage {
  protected readonly plain = `<div class="pr-field">
  <label for="country">Country</label>
  <select id="country" autocomplete="country-name" required aria-describedby="country-message">
    <option value="">Choose a country</option>
    <option>Israel</option>
    <option>Portugal</option>
  </select>
  <p class="pr-field-message" id="country-message" aria-live="polite"></p>
</div>`;
}
