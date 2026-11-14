import { Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  PRIMAL_ACTIONS,
  PRIMAL_CONTENT,
  PRIMAL_FORMS,
  PRIMAL_TABLES,
  PRIMAL_TOP_LAYERS,
  PrimalToaster,
  primalFocusAfterRemove,
} from '@mycelium-llc/primal-angular';
import { Project, STATUS_LABEL, STATUS_STATE } from '../data';
import { Workspace } from '../workspace';

/**
 * Projects: a sortable table (Primal sorts every table by its columns), its empty state, a dialog
 * that creates one, and a delete that can be undone.
 */
@Component({
  selector: 'app-projects',
  imports: [RouterLink, PRIMAL_FORMS, PRIMAL_ACTIONS, PRIMAL_TOP_LAYERS, PRIMAL_CONTENT, PRIMAL_TABLES],
  templateUrl: './projects.html',
})
export class Projects {
  protected readonly workspace = inject(Workspace);
  private readonly router = inject(Router);
  private readonly toaster = inject(PrimalToaster);
  private readonly rows = viewChild<ElementRef<HTMLElement>>('rows');

  protected readonly statusLabel = STATUS_LABEL;
  protected readonly statusState = STATUS_STATE;
  protected readonly creating = signal(false);

  /** Every new project starts from an empty form. */
  protected startCreating(form: HTMLFormElement): void {
    form.reset();
    this.creating.set(true);
  }

  /** Runs only when the form is complete (validSubmit); the new project opens, as made things do. */
  protected create(form: HTMLFormElement): void {
    const answers = new FormData(form);
    const project = this.workspace.createProject({
      name: String(answers.get('name')).trim(),
      owner: String(answers.get('owner')),
      status: 'active',
      summary: String(answers.get('summary') ?? '').trim(),
    });
    this.creating.set(false);
    void this.router.navigate(['/projects', project.slug]);
  }

  protected remove(project: Project): void {
    const rows = this.rows()?.nativeElement;
    if (rows) primalFocusAfterRemove(rows, { item: 'tr', fallback: () => document.getElementById('projects-title') });
    const undo = this.workspace.removeProject(project.slug);
    this.toaster.show(`Deleted “${project.name}”.`, { action: { label: 'Undo', run: undo } });
  }
}
