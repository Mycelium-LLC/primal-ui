import { TestBed } from '@angular/core/testing';
import { PrimalPagination } from './pagination';

describe('PrimalPagination', () => {
  it('keeps the first, last and nearby pages, and folds the rest into a gap', async () => {
    const fixture = TestBed.createComponent(PrimalPagination);
    fixture.componentRef.setInput('pages', 12);
    fixture.componentRef.setInput('page', 6);
    await fixture.whenStable();
    const items = [...fixture.nativeElement.querySelectorAll('li')].map((li: HTMLElement) => li.textContent!.trim());
    expect(items).toEqual(['Previous Page', '1', '…', '5', '6', '7', '…', '12', 'Next Page']);
    expect(fixture.nativeElement.querySelector('[aria-current="page"]').textContent.trim()).toBe('6');
  });
});
