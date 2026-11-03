import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { PRIMAL_ACTIONS, PRIMAL_FORMS, PRIMAL_NAVIGATION, PRIMAL_TOP_LAYERS, PRIMAL_TOP_LAYER_ANSWERS, PrimalConfirm } from 'primal-angular';
import { PlainHtml } from '../../../shell/plain-html/plain-html';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

@Component({
  selector: 'pr-navigation-dialogs-page',
  imports: [PRIMAL_TOP_LAYERS, PRIMAL_ACTIONS, PRIMAL_FORMS, PRIMAL_NAVIGATION, PlainHtml],
  templateUrl: './dialogs.html',
  styleUrl: '../../actions/actions-pages.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationDialogsPage {
  private readonly confirm = inject(PrimalConfirm);
  protected readonly answers = PRIMAL_TOP_LAYER_ANSWERS;

  protected readonly name = signal('Q3 revenue');
  protected readonly draft = signal('');
  protected readonly renaming = signal(false);
  protected readonly rename = async () => {
    const next = this.draft().trim();
    if (!next) return;
    await wait(400);
    this.name.set(next);
    this.renaming.set(false);
  };

  protected readonly answer = signal('');
  protected async deleteWorkspace(): Promise<void> {
    const yes = await this.confirm.ask({
      title: 'Delete “Acme Studio” for good?',
      body: 'Its 12 reports and 4 members go with it. This can’t be undone.',
      confirm: 'Delete Workspace',
      cancel: 'Keep Workspace',
      kind: 'destructive',
    });
    // The demo deletes nothing (mock).
    this.answer.set(yes ? 'You chose Delete Workspace.' : 'You kept the workspace.');
  }

  // Sample people for the sharing example (mock).
  protected readonly people = [
    { name: 'Ada Shapiro', access: 'Editor' },
    { name: 'Noa Levi', access: 'Viewer' },
  ];
  protected readonly sharing = signal(false);

  protected readonly plain = `<button type="button" onclick="rename.showModal()">Rename Report</button>

<dialog id="rename" class="pr-dialog" aria-labelledby="rename-title">
  <div class="pr-dialog-header">
    <h2 class="pr-dialog-title" id="rename-title">Rename report</h2>
    <form method="dialog">
      <button class="pr-icon-button pr-button-quiet pr-dialog-close" aria-label="Close Dialog">×</button>
    </form>
  </div>
  <div class="pr-dialog-body">…</div>
  <form class="pr-dialog-actions" method="dialog">
    <button class="pr-button-quiet">Keep Name</button>
    <button class="pr-button-primary" value="rename">Rename Report</button>
  </form>
</dialog>`;
}
