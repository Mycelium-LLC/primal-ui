import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { PrimalSkipLink } from './skip-link';

@Component({
  imports: [PrimalSkipLink],
  template: `<a class="pr-skip" href="#main">Skip to Content</a><nav><a href="/x">X</a></nav><main id="main" tabindex="-1">Place</main>`,
})
class Host {}

describe('PrimalSkipLink', () => {
  it('moves focus to the main content without leaving the page', async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;
    document.body.append(el);
    const link = el.querySelector<HTMLAnchorElement>('.pr-skip')!;
    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
    link.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(el.querySelector('#main'));
    el.remove();
  });
});
