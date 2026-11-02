/**
 * Primal's behaviour model, written once. Every message the system gives is placed by three
 * facts: what it is, who is saying it, and what it wants from the person. The facts pick the
 * place; nobody picks a toast by taste. The showcase reads these same words.
 */

/** Who is saying it. */
export type PrimalSpeaker = 'the person' | 'the system' | 'an agent' | 'the outside world';

/** What it wants from the person. */
export type PrimalAsk = 'nothing' | 'a glance' | 'a decision' | 'everything';

export type PrimalPlaceName = 'in-place' | 'beside' | 'alert' | 'toast' | 'banner' | 'dialog';

export interface PrimalPlace {
  readonly name: PrimalPlaceName;
  readonly title: string;
  /** What a message in this place means, in one sentence. */
  readonly means: string;
  /** What it asks of the person. */
  readonly asks: PrimalAsk;
  /** How long it stays. */
  readonly stays: string;
  /** What it is for, and what it is never for. */
  readonly forWhat: string;
  readonly never: string;
  /** The Primal parts that speak from this place. */
  readonly parts: string;
  /** The release that builds it, when it is not built yet. */
  readonly release?: string;
}

/** The fixed set of places, from the quietest to the loudest. Each has one meaning. */
export const PRIMAL_PLACES: readonly PrimalPlace[] = [
  {
    name: 'in-place',
    title: 'In place',
    means: 'The thing you touched answers you: it heard you, it is working, it is done.',
    asks: 'nothing',
    stays: 'Until the work is done, then its outcome for two seconds.',
    forWhat: 'The acknowledgement of every action, and the outcome of routine and mutative ones.',
    never: 'Anything the person must read later, or an error that needs fixing.',
    parts: 'A busy button (spinner, then its word: "Saved"); a pressed toggle; a skeleton where content will be.',
  },
  {
    name: 'beside',
    title: 'Beside',
    means: 'This thing, right here, needs your attention.',
    asks: 'a decision',
    stays: 'Until it is fixed.',
    forWhat: 'A failure on the thing that failed: a field that is wrong, a row that did not save.',
    never: 'A failure shown away from its thing, in a toast or a banner.',
    parts: 'The field message (0.3.0); an inline alert under a row or a section.',
  },
  {
    name: 'alert',
    title: 'Alert',
    means: 'Something about this place is true, and stays true until it changes.',
    asks: 'a glance',
    stays: 'As long as it is true. The person cannot dismiss a fact, only change it.',
    forWhat: 'A condition of the page or section: a plan about to end, a report that is out of date.',
    never: 'The result of an action just taken (that is in place, or a toast).',
    parts: 'primal-alert, in the flow of the page, above what it is about.',
  },
  {
    name: 'toast',
    title: 'Toast',
    means: 'Something just happened where you can no longer see it.',
    asks: 'a glance',
    stays: 'Five seconds, eight with an undo; held while pointed at or focused.',
    forWhat: 'The outcome of an action whose place is gone (a deleted row) or of work that finished elsewhere, with its undo.',
    never: 'A routine outcome, a fact that stays true, a question, or an error that needs fixing.',
    parts: 'PrimalToaster: the corner, the one raised voice.',
  },
  {
    name: 'banner',
    title: 'Banner',
    means: 'The whole product is in a different state.',
    asks: 'a glance',
    stays: 'For as long as the state lasts.',
    forWhat: 'An incident or a mode: offline, maintenance, signed in as someone else. It switches the vocabulary.',
    never: 'Anything about one page, one record or one action.',
    parts: 'primal-alert with the banner treatment, edge to edge above everything it is about.',
  },
  {
    name: 'dialog',
    title: 'Dialog',
    means: 'Nothing else can happen until you answer this.',
    asks: 'everything',
    stays: 'Until the person answers.',
    forWhat: 'A real question, asked once, that the work cannot go on without.',
    never: 'A confirmation of something that can be undone. Undo it instead.',
    parts: 'The dialog primitive.',
    release: '0.6.0',
  },
];

export type PrimalActionKind = 'destructive' | 'constructive' | 'mutative' | 'navigational' | 'background' | 'confirmatory';

export interface PrimalActionKindContract {
  readonly kind: PrimalActionKind;
  readonly title: string;
  /** What it does, in one sentence. */
  readonly does: string;
  /** What stands between the press and the effect. */
  readonly gate: string;
  /** From the press to the end. */
  readonly sequence: string;
  /** How loud its answer is: the rung of the weight ladder. */
  readonly weight: string;
  /** How long, and through what, it can be taken back. */
  readonly reversibility: string;
  /** What shows when it fails, and where. */
  readonly error: string;
  /** Its treatment. */
  readonly looks: string;
}

/**
 * Every action kind, decided once: its gate, sequence, weight, reversibility window and error
 * contract. Every action names its kind, and behaves as its kind is written here.
 */
export const PRIMAL_ACTION_KINDS: readonly PrimalActionKindContract[] = [
  {
    kind: 'constructive',
    title: 'Constructive',
    does: 'Makes something that was not there: creates, adds, sends, publishes.',
    gate: 'None. A form checks its fields first; the action never asks "are you sure?".',
    sequence: 'Press → the button is busy at once → the new thing appears where the person expects it → the button says what happened ("Created") for two seconds.',
    weight: 'Clear, not interrupting: the outcome in place, and the new thing itself.',
    reversibility: 'Undone by its opposite (delete what was made); the outcome names where it is.',
    error: 'Beside: under the field that is wrong, or an alert above the form when the cause is not a field. The button is ready again and nothing typed is lost.',
    looks: 'The primary when it is the main thing to do here; otherwise the default.',
  },
  {
    kind: 'mutative',
    title: 'Mutative',
    does: 'Changes something that stays: saves, renames, moves, reorders, switches a setting.',
    gate: 'None.',
    sequence: 'Press → busy at once → the change shows on the thing itself → the button says "Saved" for two seconds. A switch or toggle answers by its own state, and says nothing else.',
    weight: 'Acknowledgement only, in place. No toast for a routine change.',
    reversibility: 'Changed back the way it was changed; an edit that loses work keeps the old value until it is saved.',
    error: 'Beside the thing that did not change, which returns to its old state and says why. Never a silent revert.',
    looks: 'The default, or the primary when it is the one main action (Save Changes).',
  },
  {
    kind: 'destructive',
    title: 'Destructive',
    does: 'Takes something away: deletes, removes, revokes, cancels a plan.',
    gate: 'Reversible: none, because undo is the gate. Irreversible: a gate the person cannot pass by habit, such as typing the name of what goes.',
    sequence: 'Reversible: press → the thing goes at once → a toast says what went, with Undo. Irreversible: press → the gate opens in place → the person confirms with the final button → busy → it goes, and the outcome says so.',
    weight: 'Impossible to miss. It sits apart from safe actions, a section gap away, in the danger treatment.',
    reversibility: 'Reversible: Undo in the toast for eight seconds, held while the toast is pointed at; then it is final. Irreversible: none, and it says so before, never after.',
    error: 'Beside the thing that was not deleted, which comes back. A failed undo says so in a toast that stays until closed.',
    looks: 'The danger edge; the final step of an irreversible one is the only danger fill.',
  },
  {
    kind: 'navigational',
    title: 'Navigational',
    does: 'Takes the person to another place; it changes nothing.',
    gate: 'None. Leaving a place with unsaved work asks first (that question is a dialog, 0.6.0).',
    sequence: 'Press → the new place starts at once (its skeleton, if its content is not ready) → it arrives at its top.',
    weight: 'Acknowledgement only: the place changing is the answer.',
    reversibility: 'Back, always: every place has an address, and the browser\'s Back returns to where the person was.',
    error: 'The place that could not load says so in place, with a way to try again. Never a blank page.',
    looks: 'A link. A link may look like a button when it starts a task ("Create Invoice"), and still only navigates.',
  },
  {
    kind: 'background',
    title: 'Background',
    does: 'Starts work that goes on without the person: an export, an import, a sync.',
    gate: 'None.',
    sequence: 'Press → busy at once → the button says "Started" → progress shows where the work lives (a value when the length is known) → when it ends, a toast says so if the person has gone elsewhere.',
    weight: 'Glance-sized and fading. It never interrupts.',
    reversibility: 'Cancel while it runs, where its progress shows; what it made is removed like anything else.',
    error: 'Where the work lives, in an alert that stays until the person has seen it, and in a toast if they have gone elsewhere.',
    looks: 'The default.',
  },
  {
    kind: 'confirmatory',
    title: 'Confirmatory',
    does: 'Answers a question the system asked: confirms, accepts, approves, chooses.',
    gate: 'It is the gate. Its words repeat the action ("Delete Workspace"), never "OK" or "Yes".',
    sequence: 'Press → busy at once → the question closes and the action it confirmed answers as its own kind.',
    weight: 'As heavy as the action it confirms.',
    reversibility: 'As the action it confirms. The other answer ("Keep Workspace") is always there and costs nothing.',
    error: 'The question stays open and says what went wrong, so the person can try again or leave.',
    looks: 'As the action it confirms: the final danger fill for an irreversible delete, the primary otherwise.',
  },
];

/** The contract of one kind. */
export const primalActionKind = (kind: PrimalActionKind): PrimalActionKindContract =>
  PRIMAL_ACTION_KINDS.find((k) => k.kind === kind)!;
