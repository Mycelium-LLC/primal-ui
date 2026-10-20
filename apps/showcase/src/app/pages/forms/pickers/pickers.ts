import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { PRIMAL_FORMS } from 'primal-angular';

@Component({
  selector: 'pr-forms-pickers-page',
  imports: [PRIMAL_FORMS],
  templateUrl: './pickers.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormsPickersPage {
  protected readonly volume = signal(40);
  protected readonly files = signal('');

  protected pickFiles(input: HTMLInputElement): void {
    const list = [...(input.files ?? [])];
    this.files.set(list.length ? list.map((f) => `${f.name} (${Math.ceil(f.size / 1024)} KB)`).join(', ') : '');
  }
}
