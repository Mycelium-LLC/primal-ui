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
    { label: 'Light', theme: 'light' },
    { label: 'Dark', theme: 'dark' },
  ];
}
