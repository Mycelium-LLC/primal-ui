import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PRIMAL_ACTIONS, PRIMAL_CONTENT } from '@mycelium-llc/primal-angular';
import { Workspace } from '../workspace';

/** Teams: who works together, and the way to make a new team. */
@Component({
  selector: 'app-teams',
  imports: [RouterLink, PRIMAL_ACTIONS, PRIMAL_CONTENT],
  template: `
    <div class="fn-head">
      <h1>Teams</h1>
      @if (workspace.teams().length) {
        <a primalButton routerLink="/teams/new" emphasis="primary" kind="navigational">New Team</a>
      }
    </div>
    @if (workspace.teams().length) {
      <ul class="pr-list-items">
        @for (t of workspace.teams(); track t.slug) {
          <li>
            <span class="pr-item-body">
              <span class="pr-item-title">{{ t.name }}</span>
              <span class="pr-item-line">{{ t.purpose || 'No purpose written yet.' }}</span>
            </span>
            <span class="pr-item-end">
              <span class="pr-badge">{{ t.members.length }} {{ t.members.length === 1 ? 'person' : 'people' }}</span>
            </span>
          </li>
        }
      </ul>
    } @else {
      <primal-empty title="No teams yet" reason="A team is the people who share a set of projects. Make the first one.">
        <a primalButton routerLink="/teams/new" emphasis="primary" kind="navigational">New Team</a>
      </primal-empty>
    }
  `,
})
export class Teams {
  protected readonly workspace = inject(Workspace);
}
