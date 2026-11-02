import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PRIMAL_FORMS } from 'primal-angular';
import { PlainHtml } from '../../../shell/plain-html/plain-html';
import { NAV } from '../../../shell/nav';

@Component({
  selector: 'pr-forms-text-fields-page',
  imports: [PRIMAL_FORMS, PlainHtml],
  templateUrl: './text-fields.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormsTextFieldsPage {
  // The showcase's own pages, as search results, grouped by section.
  protected readonly pages = NAV.flatMap((s) => s.pages.map((p) => ({ value: p.title, label: p.title, group: s.title })));
  // What the empty search box offers (mock "popular" pages).
  protected readonly popular = ['Colour', 'Text fields', 'Actions', 'Tables'].map((t) => ({ value: t, label: t, group: 'Popular' }));

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
