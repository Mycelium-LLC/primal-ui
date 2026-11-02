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
  --pr-black: #17140f;
  --pr-white: #fdfbf8;
  --pr-primary: #0e8763;
  --pr-companion-angle: 30; /* Analogous */
  --pr-tertiary-angle: -30;
}`;
}
