import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { PRIMAL_FORMS } from '../forms';

@Component({
  imports: [PRIMAL_FORMS],
  template: `
    <primal-field label="Owner">
      <primal-select>
        <select primalControl [value]="owner()">
          <option value="">Choose an owner</option>
          @for (o of owners(); track o) {
            <option [value]="o">{{ o }}</option>
          }
        </select>
      </primal-select>
    </primal-field>
  `,
})
class BoundSelect {
  readonly owner = signal('Noa');
  readonly owners = signal(['Ada', 'Noa']);
}

describe('PrimalSelect', () => {
  it('shows a value bound from the template, even before its options were drawn', async () => {
    const fixture = TestBed.createComponent(BoundSelect);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    await new Promise((r) => setTimeout(r, 20));
    fixture.detectChanges();
    const select = fixture.nativeElement.querySelector('select') as HTMLSelectElement;
    expect(select.value).toBe('Noa');
    expect(fixture.nativeElement.querySelector('.pr-select-value').textContent.trim()).toBe('Noa');
  });
});
