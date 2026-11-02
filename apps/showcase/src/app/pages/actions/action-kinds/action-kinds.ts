import { ChangeDetectionStrategy, Component, inject, model, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PRIMAL_ACTIONS, PRIMAL_ACTION_KINDS, PRIMAL_FEEDBACK, PRIMAL_FORMS, PrimalToaster } from 'primal-angular';

// Sample members and workspace for the examples (mock data).
const MEMBERS = ['Ada Shapiro', 'Noa Levi', 'Sam Okafor'];
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

@Component({
  selector: 'pr-actions-action-kinds-page',
  imports: [PRIMAL_ACTIONS, PRIMAL_FEEDBACK, PRIMAL_FORMS, FormsModule, RouterLink],
  templateUrl: './action-kinds.html',
  styleUrl: '../actions-pages.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionsActionKindsPage {
  private readonly toaster = inject(PrimalToaster);
  protected readonly kinds = PRIMAL_ACTION_KINDS;

  protected readonly newName = model('Q4 revenue');
  protected readonly made = signal<string[]>([]);
  protected readonly create = async () => {
    const name = this.newName().trim();
    if (!name) return;
    await wait(500);
    this.made.update((list) => [name, ...list]);
    return 'Created';
  };

  protected readonly workspaceName = model('Acme Studio');
  protected readonly rename = async () => {
    await wait(500);
    return 'Saved';
  };

  protected readonly members = signal(MEMBERS);
  protected removeMember(name: string): void {
    const before = this.members();
    this.members.update((list) => list.filter((m) => m !== name));
    this.toaster.show(`Removed ${name} from the workspace.`, { action: { label: 'Undo', run: () => this.members.set(before) } });
  }
  protected resetMembers(): void {
    this.members.set(MEMBERS);
  }

  protected readonly confirming = signal(false);
  protected readonly typedName = model('');
  protected readonly workspaceGone = signal(false);
  protected readonly deleteWorkspace = async () => {
    if (this.typedName() !== 'Acme Studio') return;
    await wait(900);
    this.workspaceGone.set(true);
    this.confirming.set(false);
  };
  protected cancelDelete(): void {
    this.confirming.set(false);
    this.typedName.set('');
  }
  protected resetWorkspace(): void {
    this.workspaceGone.set(false);
    this.typedName.set('');
  }

  protected readonly syncing = signal(false);
  protected readonly synced = signal(0);
  protected readonly startSync = async () => {
    this.synced.set(0);
    this.syncing.set(true);
    void this.runSync();
    return 'Started';
  };
  private async runSync(): Promise<void> {
    for (let i = 1; i <= 40; i++) {
      await wait(100);
      this.synced.set(i);
    }
    this.syncing.set(false);
    this.toaster.show('Synced 40 contacts.');
  }
}
