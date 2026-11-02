import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { PrimalTable } from './table';

@Component({
  imports: [PrimalTable],
  template: `
    <table>
      <thead><tr><th>Name</th><th data-numeric>Amount</th></tr></thead>
      <tbody>
        @for (r of rows(); track r.name) {
          <tr><td>{{ r.name }}</td><td>{{ r.amount }}</td></tr>
        }
      </tbody>
    </table>
    <table id="off" sortable="false"><thead><tr><th>Step</th></tr></thead><tbody><tr><td>1</td></tr></tbody></table>
  `,
})
class Host {
  readonly rows = signal([
    { name: 'Acme', amount: 12 },
    { name: 'Globex', amount: 3 },
  ]);
}

const amounts = (el: HTMLElement) => [...el.querySelectorAll('table:not(#off) tbody tr')].map((r) => r.children[1].textContent!.trim());
const tick = () => new Promise((r) => setTimeout(r));

describe('PrimalTable', () => {
  it('sorts by a column, and keeps the sort when a row is added', async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;
    const amount = el.querySelectorAll<HTMLButtonElement>('table:not(#off) .pr-sort')[1];
    amount.click();
    expect(amount.closest('th')!.getAttribute('aria-sort')).toBe('ascending');
    expect(amounts(el)).toEqual(['3', '12']);

    fixture.componentInstance.rows.update((rows) => [...rows, { name: 'Initech', amount: 7 }]);
    await fixture.whenStable();
    await tick();
    expect(amounts(el)).toEqual(['3', '7', '12']);
  });

  it('can be turned off with a plain attribute', async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('#off .pr-sort')).toBeNull();
  });
});
