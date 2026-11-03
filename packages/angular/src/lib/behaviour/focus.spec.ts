import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { primalFocusAfterRemove } from './focus';

function list(names: string[]): HTMLUListElement {
  const ul = document.createElement('ul');
  ul.innerHTML = names.map((n) => `<li>${n} <a href="#${n}">Open</a> <button>Delete ${n}</button></li>`).join('');
  document.body.append(ul);
  return ul;
}

// Every spec shares one page, so the clock goes back to real after each test here.
afterEach(() => vi.useRealTimers());

describe('primalFocusAfterRemove', () => {
  it('moves focus to the next item’s same control', () => {
    vi.useFakeTimers();
    const ul = list(['a', 'b', 'c']);
    ul.querySelectorAll('button')[1].focus();
    primalFocusAfterRemove(ul);
    ul.children[1].remove();
    vi.runAllTimers();
    expect(document.activeElement?.textContent).toBe('Delete c');
    ul.remove();
  });

  it('moves to the last item when the last one goes, and to the fallback when none is left', () => {
    vi.useFakeTimers();
    const ul = list(['a', 'b']);
    const heading = document.createElement('h2');
    document.body.append(heading);
    ul.querySelectorAll('button')[1].focus();
    primalFocusAfterRemove(ul, { fallback: () => heading });
    ul.children[1].remove();
    vi.runAllTimers();
    expect(document.activeElement?.textContent).toBe('Delete a');
    primalFocusAfterRemove(ul, { fallback: () => heading });
    ul.children[0].remove();
    vi.runAllTimers();
    expect(document.activeElement).toBe(heading);
    ul.remove();
    heading.remove();
  });
});

@Component({
  template: `
    <h2 id="people-title" tabindex="-1">People</h2>
    @if (people().length) {
      <ul #list>
        @for (p of people(); track p) {
          <li>{{ p }} <button type="button" (click)="remove(p, list)">Delete {{ p }}</button></li>
        }
      </ul>
    } @else {
      <p>No people.</p>
    }
  `,
})
class EmptyStateList {
  readonly people = signal(['Ada']);
  remove(p: string, list: HTMLElement): void {
    primalFocusAfterRemove(list, { fallback: () => document.getElementById('people-title') });
    this.people.update((all) => all.filter((x) => x !== p));
  }
}

describe('primalFocusAfterRemove with an empty state', () => {
  it('goes to the fallback when the list leaves the page with its last item', () => {
    vi.useFakeTimers();
    const fixture = TestBed.createComponent(EmptyStateList);
    document.body.append(fixture.nativeElement);
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    button.focus();
    button.click();
    fixture.detectChanges();
    vi.runAllTimers();
    expect(fixture.nativeElement.querySelector('ul')).toBeNull();
    expect(document.activeElement?.id).toBe('people-title');
    fixture.nativeElement.remove();
  });
});
