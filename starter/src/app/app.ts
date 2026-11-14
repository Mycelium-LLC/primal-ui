import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PRIMAL_NAVIGATION } from '@mycelium-llc/primal-angular';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, PRIMAL_NAVIGATION],
  template: `
    <a class="pr-skip" href="#main">Skip to Content</a>
    <header class="app-bar">
      <a class="app-brand" href="/">My Primal App</a>
    </header>
    <main id="main" class="app-main" tabindex="-1"><router-outlet /></main>
  `,
  styleUrl: './app.css',
})
export class App {}
