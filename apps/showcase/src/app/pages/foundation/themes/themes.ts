import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'pr-foundation-themes-page',
  imports: [RouterLink],
  templateUrl: './themes.html',
  styleUrl: './themes.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FoundationThemesPage {
  protected readonly example = `/* my-theme.css, loaded after Primal */
:root {
  --pr-black: #1f1b16;
  --pr-white: #faf7f2;
  --pr-primary: #0b7a5a;
  --pr-companion-angle: 30; /* Analogous */
  --pr-tertiary-angle: -30;
}`;
}
