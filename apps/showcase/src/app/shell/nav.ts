/** The showcase's navigation: every planned page, by section, with the release that builds it. */
export interface NavPage { path: string; title: string; release: string; }
export interface NavSection { title: string; pages: NavPage[]; }

export const NAV: NavSection[] = [
  {
    title: 'Start',
    pages: [
      { path: '/start', title: 'Getting started', release: '0.1.0' },
    ],
  },
  {
    title: 'Foundation',
    pages: [
      { path: '/foundation/colour', title: 'Colour', release: '0.1.0' },
      { path: '/foundation/typography', title: 'Typography', release: '0.1.0' },
      { path: '/foundation/spacing', title: 'Spacing', release: '0.1.0' },
      { path: '/foundation/shape', title: 'Shape and elevation', release: '0.1.0' },
      { path: '/foundation/motion', title: 'Motion', release: '0.1.0' },
      { path: '/foundation/themes', title: 'Themes', release: '0.1.0' },
      { path: '/foundation/direction', title: 'Direction', release: '0.1.0' },
    ],
  },
  {
    title: 'Native HTML',
    pages: [
      { path: '/native/text', title: 'Text', release: '0.2.0' },
      { path: '/native/lists', title: 'Lists', release: '0.2.0' },
      { path: '/native/quotes-and-code', title: 'Quotes and code', release: '0.2.0' },
      { path: '/native/tables', title: 'Tables', release: '0.2.0' },
      { path: '/native/media', title: 'Media', release: '0.2.0' },
      { path: '/native/page-structure', title: 'Page structure', release: '0.2.0' },
      { path: '/native/coverage', title: 'Coverage', release: '0.2.0' },
    ],
  },
  {
    title: 'Forms',
    pages: [
      { path: '/forms/text-fields', title: 'Text fields', release: '0.3.0' },
      { path: '/forms/choices', title: 'Choices', release: '0.3.0' },
      { path: '/forms/pickers', title: 'Pickers', release: '0.3.0' },
      { path: '/forms/select', title: 'Select', release: '0.3.0' },
      { path: '/forms/form-structure', title: 'Form structure', release: '0.3.0' },
      { path: '/forms/validation', title: 'Validation', release: '0.3.0' },
      { path: '/forms/examples', title: 'Example forms', release: '0.3.0' },
    ],
  },
  {
    title: 'Actions and feedback',
    pages: [
      { path: '/actions/actions', title: 'Actions', release: '0.4.0' },
      { path: '/actions/feedback', title: 'Feedback', release: '0.4.0' },
      { path: '/actions/behaviour-model', title: 'The behaviour model', release: '0.4.0' },
      { path: '/actions/action-kinds', title: 'Action kinds', release: '0.4.0' },
    ],
  },
  {
    title: 'Navigation and layers',
    pages: [
      { path: '/navigation/navigation', title: 'Navigation', release: '0.5.0' },
      { path: '/navigation/disclosure', title: 'Disclosure', release: '0.5.0' },
      { path: '/navigation/dialogs', title: 'Dialogs', release: '0.5.0' },
      { path: '/navigation/popovers', title: 'Popovers and tooltips', release: '0.5.0' },
      { path: '/navigation/focus-and-keys', title: 'Focus and keys', release: '0.5.0' },
    ],
  },
  {
    title: 'Content and cells',
    pages: [
      { path: '/content/content', title: 'Content', release: '0.6.0' },
      { path: '/content/information', title: 'Information', release: '0.6.0' },
      { path: '/content/layout', title: 'Layout', release: '0.6.0' },
      { path: '/content/cells', title: 'Cells', release: '0.6.0' },
    ],
  },
  {
    title: 'Surfaces',
    pages: [
      { path: '/surfaces/authentication', title: 'Authentication', release: '0.7.0' },
      { path: '/surfaces/app-shell', title: 'App shell', release: '0.7.0' },
      { path: '/surfaces/settings', title: 'Settings', release: '0.7.0' },
      { path: '/surfaces/list-detail', title: 'List and detail', release: '0.7.0' },
      { path: '/surfaces/multi-step-form', title: 'Multi-step form', release: '0.7.0' },
    ],
  },
  {
    title: 'Contracts',
    pages: [
      { path: '/contracts/catalog', title: 'Contract catalog', release: '0.8.0' },
    ],
  },
];

/** A page is built once its release is at or below the showcase's version. */
export function isBuilt(release: string, version: string): boolean {
  const [a, b] = [release, version].map((v) => v.split('.').map(Number));
  for (let i = 0; i < 3; i++) if (a[i] !== b[i]) return a[i] < b[i];
  return true;
}
