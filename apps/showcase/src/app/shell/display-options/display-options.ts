import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  PrimalDirection,
  PrimalPreferences,
  PrimalTheme,
} from 'primal-angular';

/** The showcase's display switches: the colour scheme and the text direction, applied to the whole page in place. */
@Component({
  selector: 'pr-display-options',
  templateUrl: './display-options.html',
  styleUrl: './display-options.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DisplayOptions {
  protected readonly prefs = inject(PrimalPreferences);

  protected setTheme(value: string): void {
    this.prefs.theme.set(value as PrimalTheme);
  }

  protected setDirection(value: string): void {
    this.prefs.direction.set(value as PrimalDirection);
  }

}
