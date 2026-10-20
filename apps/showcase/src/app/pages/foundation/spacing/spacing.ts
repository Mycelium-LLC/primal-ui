import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TokenTable } from '../../../shell/token-table/token-table';
import { tokensIn } from '../../../shell/tokens';

@Component({
  selector: 'pr-foundation-spacing-page',
  imports: [TokenTable],
  templateUrl: './spacing.html',
  styleUrl: './spacing.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FoundationSpacingPage {
  protected readonly space = tokensIn('space');
  protected readonly layout = tokensIn('layout');
  protected readonly gaps = this.space.filter((t) => t.name.startsWith('--pr-gap-'));
}
