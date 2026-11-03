import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `
    <header class="app-bar">
      <a class="app-brand" href="/">My Primal App</a>
    </header>
    <main class="app-main"><router-outlet /></main>
  `,
  styleUrl: './app.css',
})
export class App {}
