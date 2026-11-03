import data from '../../../../../../packages/contracts/contracts.json';

/** A component's contract, as packages/contracts/schema.json describes it. */
export interface Contract {
  id: string;
  name: string;
  layer: 'primitive' | 'cell' | 'surface';
  layerWhy: string;
  promise: string;
  expectation: string;
  evidence: string;
  behaviour: string[];
  context: string;
  relationships: string[];
  states: string[];
  accessibility: string[];
  failures: string[];
  do: string[];
  dont: string[];
  api: { css: string[]; angular?: string[]; inputs?: string[] };
  usage: { import?: string; markup: string };
  example: string;
}

/** Every contract, generated from packages/contracts/src: the pages below are built from these, nothing by hand. */
export const CONTRACTS = data.contracts as Contract[];

export const LAYERS = [
  { layer: 'primitive', title: 'Primitives', means: 'Parts of a promise that are not yet a whole job.' },
  { layer: 'cell', title: 'Cells', means: 'One complete, predictable job each, built from primitives.' },
  { layer: 'surface', title: 'Surfaces', means: 'Places where cells serve a journey.' },
] as const;
