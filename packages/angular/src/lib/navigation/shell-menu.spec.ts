import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { PrimalShellMenu } from './shell-menu';

@Component({
  imports: [PrimalShellMenu],
  template: `
    <button [primalShellMenu]="nav" #menu="primalShellMenu">Show Menu</button>
    <nav class="pr-shell-nav" #nav><a href="#a">Invoices</a><a href="#b" aria-current="page">Reports</a></nav>
  `,
})
class Shell {}

describe('PrimalShellMenu', () => {
  it('opens to the current place, and Escape closes it back to the button', async () => {
    const fixture = TestBed.createComponent(Shell);
    document.body.append(fixture.nativeElement);
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    const nav = fixture.nativeElement.querySelector('nav') as HTMLElement;
    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(button.getAttribute('aria-controls')).toBe(nav.id);

    button.click();
    fixture.detectChanges();
    await new Promise((r) => setTimeout(r, 10));
    expect(nav.hasAttribute('data-open')).toBe(true);
    expect(button.getAttribute('aria-expanded')).toBe('true');
    expect(document.activeElement?.textContent).toBe('Reports');

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    fixture.detectChanges();
    expect(nav.hasAttribute('data-open')).toBe(false);
    expect(document.activeElement).toBe(button);
    fixture.nativeElement.remove();
  });
});
