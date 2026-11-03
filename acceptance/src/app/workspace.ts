import { Service, computed, signal } from '@angular/core';
import { Note, PEOPLE, PROJECTS, Project, ProjectStatus, TEAMS, Team, slugify, today } from './data';

/** The workspace's projects and teams, in memory (seeded from data.ts, mock). */
@Service()
export class Workspace {
  readonly people = PEOPLE;
  readonly projects = signal<Project[]>([...PROJECTS]);
  readonly teams = signal<Team[]>([...TEAMS]);
  private nextNote = 100;

  readonly projectCount = computed(() => this.projects().length);

  project(slug: string): Project | undefined {
    return this.projects().find((p) => p.slug === slug);
  }

  /** A slug no other project has: "river-survey", then "river-survey-2". */
  private freeSlug(name: string, taken: (slug: string) => boolean): string {
    const base = slugify(name) || 'project';
    let slug = base;
    for (let n = 2; taken(slug); n++) slug = `${base}-${n}`;
    return slug;
  }

  createProject(input: { name: string; owner: string; status: ProjectStatus; summary: string }): Project {
    const project: Project = {
      slug: this.freeSlug(input.name, (s) => !!this.project(s)),
      name: input.name,
      owner: input.owner,
      status: input.status,
      summary: input.summary,
      updated: today(),
      notes: [],
    };
    this.projects.update((all) => [...all, project]);
    return project;
  }

  /** Removes a project and returns a way to put it back where it was. */
  removeProject(slug: string): () => void {
    const all = this.projects();
    const at = all.findIndex((p) => p.slug === slug);
    if (at < 0) return () => {};
    const project = all[at];
    this.projects.set(all.filter((p) => p.slug !== slug));
    return () =>
      this.projects.update((now) => {
        if (now.some((p) => p.slug === project.slug)) return now;
        const copy = [...now];
        copy.splice(Math.min(at, copy.length), 0, project);
        return copy;
      });
  }

  renameProject(slug: string, name: string): void {
    this.patch(slug, (p) => ({ ...p, name, updated: today() }));
  }

  addNote(slug: string, text: string, author: string): void {
    const note: Note = { id: this.nextNote++, text, author, written: today() };
    this.patch(slug, (p) => ({ ...p, notes: [note, ...p.notes], updated: today() }));
  }

  /** Removes a note and returns a way to put it back where it was. */
  removeNote(slug: string, id: number): () => void {
    const project = this.project(slug);
    const at = project?.notes.findIndex((n) => n.id === id) ?? -1;
    if (!project || at < 0) return () => {};
    const note = project.notes[at];
    this.patch(slug, (p) => ({ ...p, notes: p.notes.filter((n) => n.id !== id) }));
    return () =>
      this.patch(slug, (p) => {
        if (p.notes.some((n) => n.id === id)) return p;
        const notes = [...p.notes];
        notes.splice(Math.min(at, notes.length), 0, note);
        return { ...p, notes };
      });
  }

  createTeam(input: { name: string; purpose: string; members: string[] }): Team {
    const team: Team = { slug: this.freeSlug(input.name, (s) => this.teams().some((t) => t.slug === s)), ...input };
    this.teams.update((all) => [...all, team]);
    return team;
  }

  private patch(slug: string, change: (p: Project) => Project): void {
    this.projects.update((all) => all.map((p) => (p.slug === slug ? change(p) : p)));
  }
}
