import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { PRIMAL_ACTIONS, PRIMAL_CONTENT } from 'primal-angular';
import { CONTRACTS, LAYERS } from '../contracts';

/** One component's contract, generated from packages/contracts: nothing on this page is written by hand. */
@Component({
  selector: 'pr-contracts-contract-page',
  imports: [PRIMAL_ACTIONS, PRIMAL_CONTENT, RouterLink],
  templateUrl: './contract.html',
  styles: `
    .pr-contract-layer {
      color: var(--pr-color-text-muted);
    }

    .pr-contract-next {
      margin-block-start: var(--pr-gap-section);
      padding-block-start: var(--pr-gap-group);
      border-block-start: var(--pr-border-width) solid var(--pr-color-border);
    }

    code {
      overflow-wrap: anywhere;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContractsContractPage {
  /** From the address: the contract's id. */
  readonly id = input.required<string>();

  protected readonly contract = computed(() => CONTRACTS.find((c) => c.id === this.id()));
  private readonly at = computed(() => CONTRACTS.findIndex((c) => c.id === this.id()));
  protected readonly previous = computed(() => (this.at() > 0 ? CONTRACTS[this.at() - 1] : undefined));
  protected readonly next = computed(() => (this.at() >= 0 && this.at() < CONTRACTS.length - 1 ? CONTRACTS[this.at() + 1] : undefined));
  protected readonly layerTitle = computed(() => LAYERS.find((l) => l.layer === this.contract()?.layer)?.title.replace(/s$/, '') ?? '');

  /** The live example's page, with its query (?step=…) split off for the router. */
  protected readonly exampleLink = computed(() => this.contract()?.example.split('?')[0] ?? '/');
  protected readonly exampleQuery = computed(() => Object.fromEntries(new URLSearchParams(this.contract()?.example.split('?')[1] ?? '')));

  constructor() {
    const title = inject(Title);
    effect(() => {
      const c = this.contract();
      title.setTitle(c ? `${c.name} · Contract catalog · Primal` : 'No such contract · Primal');
    });
  }
}
