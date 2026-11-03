import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { PRIMAL_FORMS } from '@mycelium-llc/primal-angular';

@Component({
  selector: 'pr-forms-examples-page',
  imports: [PRIMAL_FORMS],
  templateUrl: './examples.html',
  styleUrl: './examples.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormsExamplesPage {
  // MOCK: nothing is sent anywhere; each form only confirms that it would.
  protected readonly signedIn = signal('');
  protected readonly profileSaved = signal(false);
  protected readonly settingsNote = signal('');

  protected signIn(form: HTMLFormElement): void {
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    this.signedIn.set(`Signed in as ${email}.`);
  }

  protected changed(what: string, on: boolean): void {
    this.settingsNote.set(`${what} ${on ? 'turned on' : 'turned off'}.`);
  }
}
