/**
 * The seven questions every top layer answers, answered once for every product built on Primal.
 * The showcase reads these same words.
 */
export interface PrimalLayerAnswer {
  readonly question: string;
  readonly answer: string;
}

export const PRIMAL_TOP_LAYER_ANSWERS: readonly PrimalLayerAnswer[] = [
  {
    question: 'What earns a modal?',
    answer:
      'Only a question the work cannot go on without, asked once: confirming something that cannot be undone, or a short task that must finish before the page makes sense again. Something that can be undone is never asked; it is done, with Undo.',
  },
  {
    question: 'Beside or over?',
    answer:
      'Beside by default: a popover, a menu or a tooltip leaves the page the person\'s own, and it still scrolls and reads. Over (a dialog) only for what earns a modal. A panel that holds work the person moves between is beside, not over.',
  },
  {
    question: 'What is a place?',
    answer:
      'A place is somewhere the person can be, come back to and send to someone: it has an address. A layer is not a place. If people will want to link to it, or come back to it tomorrow, it is a page, not a dialog.',
  },
  {
    question: 'Which layers get an address?',
    answer:
      'None of the top layers. A dialog, popover, menu or tooltip has no address of its own, and Back never lands inside one. Tabs are not layers: a tab that is worth sharing keeps its face in the address (?tab=data).',
  },
  {
    question: 'How do layers stack?',
    answer:
      'In the order they opened, by the browser\'s own top layer: the newest is on top. Only one dialog at a time; a popover or menu may open from a dialog, above it. The corner (toasts) stays above everything, because it reports on things already out of sight.',
  },
  {
    question: 'What returns on close?',
    answer:
      'Focus returns to what opened the layer, and the page returns exactly as it was: the same scroll, the same selection, nothing moved under it. Escape closes the topmost layer only, never two.',
  },
  {
    question: 'What does each become on a phone?',
    answer:
      'A dialog rises from the bottom edge as a sheet, its answers stacked and full width, the main one nearest the thumb. A popover and a menu stay beside their trigger, kept inside the screen. A tooltip shows on focus and on a long press; nothing is ever only in a tooltip.',
  },
];

/** The keys of one component, in the order a person meets them. */
export interface PrimalKeys {
  readonly component: string;
  readonly keys: readonly (readonly [key: string, does: string])[];
}

/** Every component's keyboard path, written once: each one's whole job works from the keyboard. */
export const PRIMAL_KEYS: readonly PrimalKeys[] = [
  { component: 'Button, link', keys: [['Tab', 'Reaches it'], ['Enter', 'Presses it (a button also takes Space)']] },
  {
    component: 'Tabs',
    keys: [
      ['Tab', 'Reaches the chosen tab, then its face'],
      ['← →', 'Moves to the next or previous tab and shows it (follows the reading direction)'],
      ['Home, End', 'Goes to the first or last tab'],
    ],
  },
  {
    component: 'Menu',
    keys: [
      ['Enter, Space, ↓', 'Opens it on the first command'],
      ['↑', 'Opens it on the last command'],
      ['↑ ↓, Home, End', 'Moves between commands'],
      ['A letter', 'Goes to the next command starting with it'],
      ['Enter', 'Runs the command, closes the menu, focus back on its button'],
      ['Escape, Tab', 'Closes it'],
    ],
  },
  { component: 'Popover', keys: [['Enter, Space', 'Opens and closes it from its button'], ['Tab', 'Moves within it'], ['Escape', 'Closes it, focus back on its button']] },
  { component: 'Tooltip', keys: [['Tab', 'Focusing its thing shows it'], ['Escape', 'Hides it, focus stays']] },
  {
    component: 'Dialog',
    keys: [
      ['Tab', 'Moves within the dialog only'],
      ['Escape', 'Closes it when it can be dismissed, focus back on what opened it'],
      ['Enter', 'In a form, sends its main answer'],
    ],
  },
  { component: 'Accordion', keys: [['Tab', 'Reaches each summary'], ['Enter, Space', 'Opens or closes it']] },
  { component: 'Pagination', keys: [['Tab', 'Reaches each page'], ['Enter', 'Goes to it']] },
  {
    component: 'Select, autocomplete',
    keys: [
      ['↓, Alt ↓', 'Opens the list'],
      ['↑ ↓, Home, End', 'Moves through the options'],
      ['Enter', 'Chooses the option'],
      ['Escape', 'Closes the list (in a search box, clears it)'],
    ],
  },
  { component: 'Table', keys: [['Tab', 'Reaches each column header'], ['Enter', 'Sorts by it; again reverses; a third time, the order it came in']] },
  { component: 'Number', keys: [['↑ ↓', 'Steps by the field\'s step'], ['Typing', 'Sets it directly']] },
  { component: 'Toast', keys: [['Tab', 'Reaches its action (focus holds it open)'], ['Escape', 'Closes the newest']] },
];
