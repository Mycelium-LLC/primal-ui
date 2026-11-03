import { ChangeDetectionStrategy, Component, computed, effect, signal } from '@angular/core';
import { PRIMAL_TABLES } from 'primal-angular';
import {
  ADJUST,
  Adjust,
  DEFAULTS,
  NO_ADJUST,
  ROLES,
  SCHEMES,
  SYSTEM,
  audit,
  css,
  fromHex,
  harmony,
  palette,
  scale,
  SCALE,
  toHex,
} from '../../../../../../../packages/tokens/src/colour-model.mjs';

type Oklch = number[];
type Scheme = keyof typeof SCHEMES;

/** Where the page keeps the viewer's picks between visits: a per-viewer convenience, so it works without storage too. */
const KEY = 'primal-showcase-colour';
const isOklch = (v: unknown): v is Oklch => Array.isArray(v) && v.length === 3 && v.every((n) => typeof n === 'number' && Number.isFinite(n));

/** The colour page: a project's three choices and a harmony, with every role derived live. */
@Component({
  selector: 'pr-foundation-colour-page',
  imports: [PRIMAL_TABLES],
  templateUrl: './colour.html',
  styleUrl: './colour.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FoundationColourPage {
  protected readonly black = signal<Oklch>(DEFAULTS.black);
  protected readonly white = signal<Oklch>(DEFAULTS.white);
  protected readonly primary = signal<Oklch>(DEFAULTS.primary);
  protected readonly scheme = signal<Scheme>(DEFAULTS.scheme as Scheme);
  protected readonly adjust = signal<Adjust>(NO_ADJUST);
  protected readonly limits = ADJUST;
  protected readonly tunables = ['companion', 'tertiary'] as const;

  protected readonly schemes = Object.entries(SCHEMES).map(([key, s]) => ({ key: key as Scheme, ...s }));
  protected readonly toHex = toHex;

  protected readonly choices = computed(() => ({
    black: this.black(),
    white: this.white(),
    primary: this.primary(),
    scheme: this.scheme(),
    adjust: this.adjust(),
  }));

  /** Custom properties that make a [data-palette] region derive from these choices. */
  protected readonly vars = computed<Record<string, string>>(() => {
    const h = harmony(this.choices());
    return {
      '--pr-black': css(this.black()),
      '--pr-white': css(this.white()),
      '--pr-primary': css(this.primary()),
      '--pr-companion-angle': `${h.companionAngle}`,
      '--pr-tertiary-angle': `${h.tertiaryAngle}`,
      '--pr-companion-lightness': `${h.companionLightness}`,
      '--pr-tertiary-lightness': `${h.tertiaryLightness}`,
    };
  });

  protected readonly harmonies = computed(() =>
    this.schemes.map((s) => {
      const light = palette({ ...this.choices(), scheme: s.key, adjust: s.key === this.scheme() ? this.adjust() : NO_ADJUST }, 'light');
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

  /** The final palette, large: the five colours a project works with, then the system colours. */
  protected readonly final = computed(() =>
    (['light', 'dark'] as const).map((mode) => {
      const p = mode === 'light' ? this.light() : this.dark();
      const swatch = (name: string, label: string, role: string) => ({ label, role, hex: toHex(p[role]), oklch: css(p[role]) });
      return {
        mode,
        main: [
          swatch('black', mode === 'light' ? 'Black, as text' : 'Black, as the page', mode === 'light' ? 'text' : 'surface'),
          swatch('white', mode === 'light' ? 'White, as the page' : 'White, as text', mode === 'light' ? 'surface' : 'text'),
          swatch('primary', 'Primary', 'primary'),
          swatch('companion', 'Companion', 'companion'),
          swatch('tertiary', 'Tertiary', 'tertiary'),
        ],
        system: Object.keys(SYSTEM).map((name) => swatch(name, name[0].toUpperCase() + name.slice(1), name)),
      };
    }),
  );

  /** The primary's states, as a person meets them; each sample is drawn by the browser from the roles. */
  protected readonly states = [
    { label: 'Fill', role: 'primary', sample: 'Save' },
    { label: 'Hover', role: 'primary-hover', sample: 'Save' },
    { label: 'Pressed', role: 'primary-pressed', sample: 'Save' },
    { label: 'Quiet fill', role: 'primary-surface', sample: 'Current' },
    { label: 'Text', role: 'primary-text', sample: 'A link' },
    { label: 'Focus', role: 'focus', sample: 'Focus' },
  ];

  /** The primary's scale, 50 to 950: step 500 is the primary as chosen. */
  protected readonly steps = computed(() => {
    const s = scale(this.choices());
    const { black, white } = this.choices();
    return Object.keys(SCALE).map((step) => ({ step, hex: toHex(s[step]), fg: toHex(s[step][0] < 0.6 ? white : black) }));
  });

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
    const h = harmony(this.choices());
    const lightness = [
      h.companionLightness ? `\n  --pr-companion-lightness: ${h.companionLightness};` : '',
      h.tertiaryLightness ? `\n  --pr-tertiary-lightness: ${h.tertiaryLightness};` : '',
    ].join('');
    return `/* my-theme.css, loaded after Primal */
:root {
  --pr-black: ${css(this.black())};
  --pr-white: ${css(this.white())};
  --pr-primary: ${css(this.primary())};
  --pr-companion-angle: ${h.companionAngle}; /* ${s.label} */
  --pr-tertiary-angle: ${h.tertiaryAngle};${lightness}
}`;
  });

  protected readonly copied = signal(false);

  constructor() {
    this.restore();
    effect(() => {
      const saved = { black: this.black(), white: this.white(), primary: this.primary(), scheme: this.scheme(), adjust: this.adjust() };
      try {
        localStorage.setItem(KEY, JSON.stringify(saved));
      } catch {
        // No storage: the picks last for this visit only.
      }
    });
  }

  private restore(): void {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) ?? 'null');
      if (!saved) return;
      if (isOklch(saved.black)) this.black.set(saved.black);
      if (isOklch(saved.white)) this.white.set(saved.white);
      if (isOklch(saved.primary)) this.primary.set(saved.primary);
      if (saved.scheme in SCHEMES) this.scheme.set(saved.scheme);
      if (saved.adjust && typeof saved.adjust === 'object' && 'companion' in saved.adjust && 'tertiary' in saved.adjust) this.adjust.set(saved.adjust);
    } catch {
      // Unreadable or no storage: Primal's own choices.
    }
  }

  protected pick(which: 'black' | 'white' | 'primary', hex: string): void {
    this[which].set(fromHex(hex));
    this.copied.set(false);
  }

  protected useScheme(key: Scheme): void {
    this.scheme.set(key);
    this.adjust.set(NO_ADJUST);
    this.copied.set(false);
  }

  protected nudge(which: 'companion' | 'tertiary', what: 'hue' | 'lightness', value: string): void {
    this.adjust.update((a) => ({ ...a, [which]: { ...a[which], [what]: Number(value) } }));
    this.copied.set(false);
  }

  protected resetAdjust(): void {
    this.adjust.set(NO_ADJUST);
  }

  protected readonly adjusted = computed(() => JSON.stringify(this.adjust()) !== JSON.stringify(NO_ADJUST));

  protected reset(): void {
    this.black.set(DEFAULTS.black);
    this.white.set(DEFAULTS.white);
    this.primary.set(DEFAULTS.primary);
    this.scheme.set(DEFAULTS.scheme as Scheme);
    this.adjust.set(NO_ADJUST);
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
