import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PRIMAL_ACTIONS, PRIMAL_CONTENT } from 'primal-angular';
import { CONTRACTS, LAYERS } from '../contracts';

/** The catalog: every contract by layer, generated from packages/contracts. */
@Component({
  selector: 'pr-contracts-catalog-page',
  imports: [PRIMAL_ACTIONS, PRIMAL_CONTENT, RouterLink],
  templateUrl: './catalog.html',
  styleUrl: '../../actions/actions-pages.css',
  styles: `
    section {
      margin-block-start: var(--pr-gap-section);
    }

    h2 {
      margin-block-end: 0;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContractsCatalogPage {
  protected readonly filter = signal('');

  protected readonly groups = computed(() => {
    const f = this.filter().trim().toLocaleLowerCase();
    const match = (c: (typeof CONTRACTS)[number]) => !f || `${c.name} ${c.promise}`.toLocaleLowerCase().includes(f);
    return LAYERS.map((l) => ({ ...l, contracts: CONTRACTS.filter((c) => c.layer === l.layer && match(c)) })).filter((g) => g.contracts.length);
  });
}
