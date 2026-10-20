import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TokenTable } from '../../../shell/token-table/token-table';
import { tokensIn } from '../../../shell/tokens';

@Component({
  selector: 'pr-foundation-typography-page',
  imports: [TokenTable],
  templateUrl: './typography.html',
  styleUrl: './typography.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FoundationTypographyPage {
  private readonly type = tokensIn('type');
  protected readonly sizes = this.type.filter((t) => t.name.startsWith('--pr-text-'));
  protected readonly rest = this.type.filter((t) => !t.name.startsWith('--pr-text-'));
}
