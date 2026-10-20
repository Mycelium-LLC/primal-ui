import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import pkg from '../../../../package.json';
import { DisplayOptions } from './shell/display-options/display-options';
import { DisplayMemory } from './shell/display-memory';
import { NAV, isBuilt } from './shell/nav';

@Component({
  selector: 'pr-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, DisplayOptions],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly nav = NAV;
  protected readonly version = pkg.version;
  protected readonly isBuilt = (release: string) => isBuilt(release, pkg.version);
  /** On a phone the page list is a menu the person opens; on a desk it is always there. */
  protected readonly menuOpen = signal(false);

  constructor() {
    inject(DisplayMemory);
    inject(Router)
      .events.pipe(
        filter((e) => e instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.menuOpen.set(false));
  }
}
