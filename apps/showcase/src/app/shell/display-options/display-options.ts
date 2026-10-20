import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  PrimalContrast,
  PrimalDensity,
  PrimalDirection,
  PrimalPreferences,
  PrimalTheme,
} from 'primal-angular';

/** The showcase's display switches: every mode the tokens respond to, applied to the whole page in place. */
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

  protected setContrast(value: string): void {
    this.prefs.contrast.set(value as PrimalContrast);
  }

  protected setDensity(value: string): void {
    this.prefs.density.set(value as PrimalDensity);
  }

  protected setDirection(value: string): void {
    this.prefs.direction.set(value as PrimalDirection);
  }

}
