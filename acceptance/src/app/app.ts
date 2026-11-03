import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/** Field Notes: the gate (sign-in, sign-up, reset) or the shell, whichever the address asks for. */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `<router-outlet />`,
})
export class App {}
