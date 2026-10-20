import { ChangeDetectionStrategy, Component } from '@angular/core';
import { tokensIn } from '../../../shell/tokens';

@Component({
  selector: 'pr-foundation-colour-page',
  templateUrl: './colour.html',
  styleUrl: './colour.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FoundationColourPage {
  protected readonly colours = tokensIn('colour');
  protected readonly modes = [
    { label: 'Light', theme: 'light', contrast: 'standard' },
    { label: 'Dark', theme: 'dark', contrast: 'standard' },
    { label: 'Light, more contrast', theme: 'light', contrast: 'more' },
    { label: 'Dark, more contrast', theme: 'dark', contrast: 'more' },
  ];
}
