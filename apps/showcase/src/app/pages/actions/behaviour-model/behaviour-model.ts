import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PRIMAL_PLACES, PRIMAL_TABLES } from 'primal-angular';

/** The behaviour model, read from the same words the library exports. */
@Component({
  selector: 'pr-actions-behaviour-model-page',
  imports: [PRIMAL_TABLES],
  templateUrl: './behaviour-model.html',
  styleUrl: '../actions-pages.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionsBehaviourModelPage {
  protected readonly places = PRIMAL_PLACES;
}
