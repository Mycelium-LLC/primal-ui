import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import {
  DEFAULTS,
  ROLES,
  SCHEMES,
  SYSTEM,
  audit,
  css,
  fromHex,
  palette,
  toHex,
} from '../../../../../../../packages/tokens/src/colour-model.mjs';

type Oklch = number[];
type Scheme = keyof typeof SCHEMES;

/** The colour page: a project's three choices and a harmony, with every role derived live. */
@Component({
  selector: 'pr-foundation-colour-page',
  templateUrl: './colour.html',
  styleUrl: './colour.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FoundationColourPage {
  protected readonly black = signal<Oklch>(DEFAULTS.black);
  protected readonly white = signal<Oklch>(DEFAULTS.white);
  protected readonly primary = signal<Oklch>(DEFAULTS.primary);
  protected readonly scheme = signal<Scheme>(DEFAULTS.scheme as Scheme);

  protected readonly schemes = Object.entries(SCHEMES).map(([key, s]) => ({ key: key as Scheme, ...s }));
  protected readonly toHex = toHex;

  protected readonly choices = computed(() => ({
    black: this.black(),
    white: this.white(),
    primary: this.primary(),
    scheme: this.scheme(),
  }));

  /** Custom properties that make a [data-palette] region derive from these choices. */
  protected vars(scheme: Scheme = this.scheme()): Record<string, string> {
    const s = SCHEMES[scheme];
    return {
      '--pr-black': css(this.black()),
      '--pr-white': css(this.white()),
      '--pr-primary': css(this.primary()),
      '--pr-companion-angle': `${s.companion}`,
      '--pr-tertiary-angle': `${s.tertiary}`,
    };
  }

  protected readonly harmonies = computed(() =>
    this.schemes.map((s) => {
      const light = palette({ ...this.choices(), scheme: s.key }, 'light');
      return { ...s, swatches: [light['primary'], light['companion'], light['tertiary']].map(toHex) };
    }),
  );

  private readonly light = computed(() => palette(this.choices(), 'light'));
  private readonly dark = computed(() => palette(this.choices(), 'dark'));

  protected readonly roles = computed(() =>
    Object.entries(ROLES)
      .filter(([name]) => !this.isSystem(name))
      .map(([name, role]) => ({ name: `--pr-color-${name}`, meaning: role.meaning, light: toHex(this.light()[name]), dark: toHex(this.dark()[name]) })),
  );

  protected readonly system = computed(() =>
    Object.keys(SYSTEM).map((name) => ({
      name,
      meaning: SYSTEM[name as keyof typeof SYSTEM].meaning,
      light: toHex(this.light()[name]),
      dark: toHex(this.dark()[name]),
    })),
  );

  protected readonly misses = computed(() => audit(this.choices()).filter((r) => !r.ok));
  protected readonly pairs = computed(() => audit(this.choices()).length);

  protected readonly snippet = computed(() => {
    const s = SCHEMES[this.scheme()];
    return `/* my-theme.css, loaded after Primal */
:root {
  --pr-black: ${css(this.black())};
  --pr-white: ${css(this.white())};
  --pr-primary: ${css(this.primary())};
  --pr-companion-angle: ${s.companion}; /* ${s.label} */
  --pr-tertiary-angle: ${s.tertiary};
}`;
  });

  protected readonly copied = signal(false);

  protected pick(which: 'black' | 'white' | 'primary', hex: string): void {
    this[which].set(fromHex(hex));
    this.copied.set(false);
  }

  protected useScheme(key: Scheme): void {
    this.scheme.set(key);
    this.copied.set(false);
  }

  protected reset(): void {
    this.black.set(DEFAULTS.black);
    this.white.set(DEFAULTS.white);
    this.primary.set(DEFAULTS.primary);
    this.scheme.set(DEFAULTS.scheme as Scheme);
    this.copied.set(false);
  }

  protected async copy(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.snippet());
      this.copied.set(true);
    } catch {
      this.copied.set(false);
    }
  }

  private isSystem(name: string): boolean {
    return name in SYSTEM || (name.endsWith('-surface') && name.replace('-surface', '') in SYSTEM);
  }
}
