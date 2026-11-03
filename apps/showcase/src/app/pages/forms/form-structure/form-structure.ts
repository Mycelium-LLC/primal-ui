import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { PRIMAL_FORMS } from '@mycelium-llc/primal-angular';

@Component({
  selector: 'pr-forms-form-structure-page',
  imports: [PRIMAL_FORMS],
  templateUrl: './form-structure.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormsFormStructurePage {
  protected readonly seats = signal(5);
  protected readonly price = 12;
  protected readonly total = computed(() => this.seats() * this.price);
  protected readonly storage = 64;
}
