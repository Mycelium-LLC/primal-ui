import { describe, expect, it, vi } from 'vitest';
import { primalFocusAfterRemove } from './focus';

function list(names: string[]): HTMLUListElement {
  const ul = document.createElement('ul');
  ul.innerHTML = names.map((n) => `<li>${n} <a href="#${n}">Open</a> <button>Delete ${n}</button></li>`).join('');
  document.body.append(ul);
  return ul;
}

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
