import { Service, signal } from '@angular/core';

export type Digest = 'daily' | 'weekly' | 'never';

/** The signed-in person's notification choices, kept in memory (mock) so leaving loses nothing. */
@Service()
export class NotificationSettings {
  readonly switches = signal([
    { key: 'notes', label: 'When someone adds a note', description: 'On projects you own or follow.', on: true },
    { key: 'status', label: 'When a project changes status', description: 'Active, paused or done.', on: false },
    { key: 'mentions', label: 'When someone mentions you', description: 'Always on email, at once.', on: true },
  ]);
  readonly digest = signal<Digest>('weekly');

  set(key: string, on: boolean): void {
    this.switches.update((all) => all.map((s) => (s.key === key ? { ...s, on } : s)));
  }
}
