import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PRIMAL_FORMS, PrimalOption } from '@mycelium-llc/primal-angular';
import { PlainHtml } from '../../../shell/plain-html/plain-html';

@Component({
  selector: 'pr-forms-select-page',
  imports: [PRIMAL_FORMS, PlainHtml],
  templateUrl: './select.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormsSelectPage {
  // Sample answers for the examples (mock data).
  protected readonly countries = [
    'Argentina', 'Australia', 'Austria', 'Belgium', 'Brazil', 'Canada', 'Chile', 'Czechia', 'Denmark', 'Estonia', 'Finland',
    'France', 'Germany', 'Greece', 'Iceland', 'India', 'Ireland', 'Israel', 'Italy', 'Japan', 'Mexico', 'Netherlands',
    'New Zealand', 'Norway', 'Poland', 'Portugal', 'Singapore', 'South Korea', 'Spain', 'Sweden', 'Switzerland',
    'United Kingdom', 'United States', 'Uruguay',
  ];
  protected readonly cities: PrimalOption[] = [
    ...['Tel Aviv', 'Jerusalem', 'Haifa', 'Be’er Sheva'].map((c) => ({ value: c, label: c, group: 'Israel' })),
    ...['Lisbon', 'Porto', 'Coimbra', 'Faro'].map((c) => ({ value: c, label: c, group: 'Portugal' })),
    ...['London', 'Manchester', 'Edinburgh'].map((c) => ({ value: c, label: c, group: 'United Kingdom' })),
  ];

  protected readonly plain = `<!-- Primal draws the list with its Angular adapter. Without it, the same markup
     keeps the browser's own list: -->
<div class="pr-field">
  <label for="country">Country</label>
  <select id="country" autocomplete="country-name" required aria-describedby="country-message">
    <option value="">Choose a country</option>
    <option>Israel</option>
    <option>Portugal</option>
  </select>
  <p class="pr-field-message" id="country-message" aria-live="polite"></p>
</div>

<!-- In Angular: -->
<primal-field label="Country">
  <primal-select>
    <select primalControl required>…</select>
  </primal-select>
</primal-field>

<primal-field label="City">
  <primal-autocomplete [options]="cities">
    <input primalControl type="text" />
  </primal-autocomplete>
</primal-field>`;
}
