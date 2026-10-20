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

export interface Adjust {
  companion: { hue: number; lightness: number };
  tertiary: { hue: number; lightness: number };
}

export interface Choices {
  black: Oklch;
  white: Oklch;
  primary: Oklch;
  scheme?: string;
  adjust?: Adjust;
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
export const ADJUST: Record<'hue' | 'lightness', { min: number; max: number; step: number; meaning: string }>;
export const NO_ADJUST: Adjust;
export function harmony(choices: Choices): {
  companionAngle: number;
  tertiaryAngle: number;
  companionLightness: number;
  tertiaryLightness: number;
};
export const LIGHT_CAP: number;
export const DARK_FLOOR: number;
export const TEXT_CAP: number;
export const TEXT_FLOOR: number;
/** Each step's mix: [the input it mixes towards, the primary's share in percent], or null for the primary itself. */
export const SCALE: Record<string, ['white' | 'black', number] | null>;
export function scaleCss(step: string): string;
export function scale(choices: Choices): Record<string, Oklch>;
export function palette(choices: Choices, mode: Mode): Record<string, Oklch>;
export function audit(choices: Choices): Pair[];
