// The landing page's three live pieces: your colours, the button's contract, and direction and theme.
import { audit, css, fromHex, toHex, DEFAULTS } from './primal/colour-model.mjs';

const root = document.documentElement;

// ---------------------------------------------------------------- your colours
const form = document.getElementById('colour');
const result = document.getElementById('colour-result');
const KEYS = ['black', 'white', 'primary'];

function apply() {
  const choices = { ...DEFAULTS };
  for (const key of KEYS) {
    choices[key] = fromHex(form.elements[key].value);
    root.style.setProperty(`--pr-${key}`, css(choices[key]));
  }
  const pairs = audit(choices);
  const missed = pairs.filter((p) => !p.ok).length;
  result.textContent = missed
    ? `${missed} of ${pairs.length} colour pairs miss WCAG AA with these choices. Primal tells you which, on its Colour page.`
    : `All ${pairs.length} colour pairs pass WCAG AA, in light and dark.`;
}

form.addEventListener('input', apply);
document.getElementById('colour-reset').addEventListener('click', () => {
  for (const key of KEYS) form.elements[key].value = toHex(DEFAULTS[key]);
  for (const key of KEYS) root.style.removeProperty(`--pr-${key}`);
  apply();
});
apply();

// ---------------------------------------------------------------- the button's contract, from the catalog itself
fetch('primal/contracts.json')
  .then((r) => (r.ok ? r.json() : null))
  .then((data) => {
    const button = data?.contracts.find((c) => c.id === 'button');
    if (!button) return;
    document.querySelector('[data-part="promise"]').textContent = button.promise;
    document.querySelector('[data-part="states"]').textContent = button.states.map((s) => s.replace(/ \(.*\)$/, '')).join(', ');
  })
  .catch(() => {});

// ---------------------------------------------------------------- direction and theme
function toggle(button, on, off, initially, apply) {
  const set = (pressed) => {
    button.setAttribute('aria-pressed', String(pressed));
    button.textContent = pressed ? off : on;
    apply(pressed);
  };
  set(initially);
  button.addEventListener('click', () => set(button.getAttribute('aria-pressed') !== 'true'));
}
toggle(document.getElementById('flip-direction'), 'Read Right to Left', 'Read Left to Right', false, (rtl) =>
  root.setAttribute('dir', rtl ? 'rtl' : 'ltr'),
);
// Starts where the visitor's system is, and says so.
const systemDark = matchMedia('(prefers-color-scheme: dark)').matches;
toggle(document.getElementById('flip-theme'), 'Turn Dark On', 'Turn Dark Off', systemDark, (dark) =>
  dark === systemDark ? root.removeAttribute('data-theme') : root.setAttribute('data-theme', dark ? 'dark' : 'light'),
);

// ---------------------------------------------------------------- the version this page states
fetch('version.json')
  .then((r) => (r.ok ? r.json() : null))
  .then((v) => v && (document.getElementById('version').textContent = `Version ${v.version}.`))
  .catch(() => {});
