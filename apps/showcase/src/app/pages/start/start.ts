import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'pr-start-page',
  imports: [RouterLink],
  templateUrl: './start.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StartPage {
  protected readonly html = `<link rel="stylesheet" href="primal/primal-tokens.css" />
<link rel="stylesheet" href="primal/css/primal.css" />
<link rel="stylesheet" href="my-theme.css" />`;

  protected readonly angularJson = `"styles": [
  "node_modules/@mycelium-llc/primal-tokens/primal-tokens.css",
  "node_modules/@mycelium-llc/primal-css/src/primal.css",
  "src/my-theme.css"
]`;

  protected readonly config = `import { provideRouter } from '@angular/router';
import { providePrimalRouteScroll, withPrimalTransitions } from '@mycelium-llc/primal-angular';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes, withPrimalTransitions()), providePrimalRouteScroll()],
};`;

  protected readonly prefs = `import { inject } from '@angular/core';
import { PrimalPreferences } from '@mycelium-llc/primal-angular';

export class AppShell {
  private readonly prefs = inject(PrimalPreferences);

  protected useDark(): void {
    this.prefs.theme.set('dark'); // 'system' | 'light' | 'dark'
  }

  protected useHebrew(): void {
    this.prefs.direction.set('rtl'); // 'ltr' | 'rtl'
  }

  protected keepScrollOnPageChange(): void {
    this.prefs.scrollToTop.set(false); // on by default
  }
}`;

  protected readonly theme = `/* my-theme.css, loaded after Primal */
:root {
  --pr-black: #17140f;
  --pr-white: #fdfbf8;
  --pr-primary: #0e8763;
  --pr-companion-angle: 30; /* Analogous */
  --pr-tertiary-angle: -30;
}`;

  protected readonly build = `# in a clone of Mycelium-LLC/primal-ui
npm install
npm run pack            # writes dist/packs/*.tgz

# in your project
npm install /path/to/primal-ui/dist/packs/*.tgz`;
}
