import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'pr-foundation-themes-page',
  templateUrl: './themes.html',
  styleUrl: './themes.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FoundationThemesPage {
  protected readonly regions = [
    { label: 'Dark', attrs: { theme: 'dark', contrast: null, density: null } },
    { label: 'More contrast', attrs: { theme: null, contrast: 'more', density: null } },
    { label: 'Dense', attrs: { theme: null, contrast: null, density: 'dense' } },
  ];

  protected readonly example = `/* my-product-theme.css, loaded after primal-tokens.css */
:root {
  --pr-color-accent: light-dark(oklch(45% 0.1 160), oklch(76% 0.11 160));
  --pr-font-sans: Georgia, serif;
  --pr-radius-control: 999px;
  --pr-gap-group: 0.75rem;
}`;
}
