import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TokenTable } from '../../../shell/token-table/token-table';
import { tokensIn } from '../../../shell/tokens';

@Component({
  selector: 'pr-foundation-motion-page',
  imports: [TokenTable],
  templateUrl: './motion.html',
  styleUrl: './motion.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FoundationMotionPage {
  protected readonly motion = tokensIn('motion');
  protected readonly durations = this.motion.filter((t) => t.name.startsWith('--pr-duration-'));
  protected readonly moved = signal(false);
}
