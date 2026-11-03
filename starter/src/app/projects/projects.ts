import { ChangeDetectionStrategy, Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import {
  PRIMAL_ACTIONS,
  PRIMAL_CONTENT,
  PRIMAL_FORMS,
  PRIMAL_TOP_LAYERS,
  PrimalToaster,
  primalFocusAfterRemove,
} from '@mycelium-llc/primal-angular';

interface Project {
  readonly id: number;
  readonly name: string;
  readonly owner: string;
}

/**
 * A first screen to grow from: a list, its empty state, a dialog that creates, and a delete
 * that can be undone. Every behaviour (busy buttons, focus, the toast's Undo) comes from Primal.
 * The projects live in memory; replace them with your data.
 */
@Component({
  selector: 'app-projects',
  imports: [PRIMAL_FORMS, PRIMAL_ACTIONS, PRIMAL_TOP_LAYERS, PRIMAL_CONTENT],
  templateUrl: './projects.html',
  styleUrl: './projects.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Projects {
  private readonly toaster = inject(PrimalToaster);
  private readonly list = viewChild<ElementRef<HTMLElement>>('list');
  private nextId = 1;

  protected readonly projects = signal<Project[]>([]);
  protected readonly creating = signal(false);
  protected readonly name = signal('');
  protected readonly owner = signal('');

  protected readonly create = async () => {
    const project = { id: this.nextId++, name: this.name().trim(), owner: this.owner().trim() || 'You' };
    this.projects.update((all) => [...all, project]);
    this.creating.set(false);
    this.name.set('');
    this.owner.set('');
    return 'Created';
  };

  protected remove(project: Project): void {
    const list = this.list()?.nativeElement;
    if (list) primalFocusAfterRemove(list, { fallback: () => document.getElementById('projects-title') });
    const before = this.projects();
    this.projects.update((all) => all.filter((p) => p !== project));
    this.toaster.show(`Deleted “${project.name}”.`, { action: { label: 'Undo', run: () => this.projects.set(before) } });
  }
}
