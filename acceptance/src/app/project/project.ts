import { Component, ElementRef, computed, inject, input, signal, viewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  PRIMAL_ACTIONS,
  PRIMAL_CONTENT,
  PRIMAL_FORMS,
  PRIMAL_NAVIGATION,
  PRIMAL_TOP_LAYERS,
  PrimalToaster,
  primalFocusAfterRemove,
} from '@mycelium-llc/primal-angular';
import { Note, STATUS_LABEL, STATUS_STATE } from '../data';
import { Workspace } from '../workspace';
import { Auth } from '../auth/auth';

/** One project at its own address (/projects/<slug>): its notes, its details and its people, as tabs. */
@Component({
  selector: 'app-project',
  imports: [RouterLink, PRIMAL_FORMS, PRIMAL_ACTIONS, PRIMAL_NAVIGATION, PRIMAL_TOP_LAYERS, PRIMAL_CONTENT],
  templateUrl: './project.html',
})
export class ProjectPage {
  private readonly workspace = inject(Workspace);
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);
  private readonly toaster = inject(PrimalToaster);
  private readonly notesList = viewChild<ElementRef<HTMLElement>>('notesList');

  /** From the address. */
  readonly slug = input.required<string>();
  protected readonly project = computed(() => this.workspace.project(this.slug()));
  protected readonly statusLabel = STATUS_LABEL;
  protected readonly statusState = STATUS_STATE;
  protected readonly tab = signal(0);

  /** Everyone who has a hand in it: the owner, then whoever wrote a note. */
  protected readonly people = computed(() => {
    const p = this.project();
    if (!p) return [];
    return [...new Set([p.owner, ...p.notes.map((n) => n.author)])];
  });

  protected readonly draft = signal('');
  protected addNote(form: HTMLFormElement): void {
    const p = this.project();
    if (!p) return;
    this.workspace.addNote(p.slug, this.draft().trim(), this.auth.account()?.name ?? 'You');
    this.draft.set('');
    form.reset();
  }

  protected removeNote(note: Note): void {
    const p = this.project();
    if (!p) return;
    const list = this.notesList()?.nativeElement;
    if (list) primalFocusAfterRemove(list, { fallback: () => document.getElementById('note-text') });
    const undo = this.workspace.removeNote(p.slug, note.id);
    this.toaster.show('Deleted the note.', { action: { label: 'Undo', run: undo } });
  }

  protected readonly renaming = signal(false);
  protected readonly newName = signal('');
  protected startRenaming(): void {
    this.newName.set(this.project()?.name ?? '');
    this.renaming.set(true);
  }

  protected rename(): void {
    const p = this.project();
    if (!p) return;
    this.workspace.renameProject(p.slug, this.newName().trim());
    this.renaming.set(false);
  }

  /** It can be undone, so it isn't asked: it is done, with Undo. */
  protected remove(): void {
    const p = this.project();
    if (!p) return;
    const undo = this.workspace.removeProject(p.slug);
    void this.router.navigateByUrl('/projects');
    this.toaster.show(`Deleted “${p.name}”.`, { action: { label: 'Undo', run: undo } });
  }
}
