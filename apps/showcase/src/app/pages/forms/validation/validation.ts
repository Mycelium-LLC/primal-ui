import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { PRIMAL_FORMS, PRIMAL_TABLES } from '@mycelium-llc/primal-angular';

@Component({
  selector: 'pr-forms-validation-page',
  imports: [PRIMAL_TABLES, PRIMAL_FORMS],
  templateUrl: './validation.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormsValidationPage {
  protected readonly done = signal(false);
  protected readonly messages: [string, string][] = [
    ['Nothing entered', 'Enter an email.'],
    ['Not an email address', 'Enter an email address like name@example.com.'],
    ['Too short', "Use at least 12 characters. You've used 7."],
    ['Below the minimum', 'Enter 18 or more.'],
    ['Not a number', 'Enter a number, using digits only.'],
    ['Wrong format', "The control's title, or: Enter the invite code in the format shown."],
    ['A required box not checked', 'Check this box to continue.'],
    ['No option chosen', 'Choose one of the options.'],
  ];
}
