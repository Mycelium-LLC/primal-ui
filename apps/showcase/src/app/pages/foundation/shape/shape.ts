import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TokenTable } from '../../../shell/token-table/token-table';
import { tokensIn } from '../../../shell/tokens';

@Component({
  selector: 'pr-foundation-shape-page',
  imports: [TokenTable],
  templateUrl: './shape.html',
  styleUrl: './shape.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FoundationShapePage {
  protected readonly shape = tokensIn('shape');
  protected readonly elevation = tokensIn('elevation');
  protected readonly layer = tokensIn('layer');
  protected readonly radii = this.shape.filter((t) => t.name.startsWith('--pr-radius-'));
}
