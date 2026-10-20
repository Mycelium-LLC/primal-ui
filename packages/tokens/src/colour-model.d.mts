/** Types for colour-model.mjs. An OKLCH colour: [lightness 0–1, chroma, hue, alpha?]. */
export type Oklch = number[];
export type Mode = 'light' | 'dark';

export interface Scheme {
  label: string;
  meaning: string;
  companion: number;
  tertiary: number;
}

export interface Role {
  meaning: string;
  css: string;
  pairs?: Record<string, 'text' | 'ui'>;
}

export interface Choices {
  black: Oklch;
  white: Oklch;
  primary: Oklch;
  scheme?: string;
}

export interface Pair {
  mode: Mode;
  fg: string;
  bg: string;
  kind: 'text' | 'ui';
  ratio: number;
  need: number;
  ok: boolean;
}

export const INPUTS: Record<'black' | 'white' | 'primary', { meaning: string; value: Oklch }>;
export const SCHEMES: Record<'complementary' | 'analogous' | 'triadic' | 'split', Scheme>;
export const DEFAULT_SCHEME: string;
export const SYSTEM: Record<'danger' | 'warning' | 'info' | 'success', { meaning: string; light: Oklch; dark: Oklch }>;
export const ROLES: Record<string, Role>;
export const DEFAULTS: Required<Choices>;

export function mix(a: Oklch, p: number, b: Oklch): Oklch;
export function luminance(c: Oklch): number;
export function contrast(a: Oklch, b: Oklch): number;
export function toHex(c: Oklch): string;
export function fromHex(hex: string): Oklch;
export function css(c: Oklch): string;
export function palette(choices: Choices, mode: Mode): Record<string, Oklch>;
export function audit(choices: Choices): Pair[];
