/** The three layers of Primal's architecture, classified by the promise an element keeps. */
export const PRIMAL_LAYERS = ['primitive', 'cell', 'surface'] as const;

export type PrimalLayer = (typeof PRIMAL_LAYERS)[number];
