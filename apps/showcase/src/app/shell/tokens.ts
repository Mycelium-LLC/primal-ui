import data from '../../../../../packages/tokens/primal-tokens.json';

/** One token as primal-tokens.json holds it: the showcase never restates a value or a meaning. */
export interface Token {
  name: string;
  group: string;
  value: string;
  meaning: string;
  light?: string;
  dark?: string;
  px?: number[];
}

export const TOKENS: Token[] = Object.entries(data as Record<string, Omit<Token, 'name'>>).map(([name, t]) => ({
  name,
  ...t,
}));

export const tokensIn = (group: string): Token[] => TOKENS.filter((t) => t.group === group);
