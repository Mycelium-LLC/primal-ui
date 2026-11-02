import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PlainHtml } from '../../../shell/plain-html/plain-html';

@Component({
  selector: 'pr-navigation-disclosure-page',
  imports: [PlainHtml],
  templateUrl: './disclosure.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationDisclosurePage {
  protected readonly plain = `<div class="pr-accordion">
  <details name="plan" open>
    <summary>Free</summary>
    <p>One person, three reports.</p>
  </details>
  <details name="plan">
    <summary>Team</summary>
    <p>Up to 20 people, every report.</p>
  </details>
</div>`;
}
