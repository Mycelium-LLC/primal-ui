import { Routes, UrlMatcher, UrlSegment } from '@angular/router';

/** /surfaces/list-detail and /surfaces/list-detail/<slug> are one route, so the list keeps its state while items open. */
const listDetail: UrlMatcher = (segments: UrlSegment[]) => {
  const [a, b, slug, ...rest] = segments.map((s) => s.path);
  if (a !== 'surfaces' || b !== 'list-detail' || rest.length) return null;
  const posParams: Record<string, UrlSegment> = slug ? { slug: segments[2] } : {};
  return { consumed: segments, posParams };
};

export const routes: Routes = [
  { path: '', title: 'Primal', loadComponent: () => import('./pages/overview/overview').then((m) => m.OverviewPage) },
  { path: 'start', title: 'Getting started · Primal', loadComponent: () => import('./pages/start/start').then((m) => m.StartPage) },
  { path: 'foundation/colour', title: 'Colour · Primal', loadComponent: () => import('./pages/foundation/colour/colour').then((m) => m.FoundationColourPage) },
  { path: 'foundation/typography', title: 'Typography · Primal', loadComponent: () => import('./pages/foundation/typography/typography').then((m) => m.FoundationTypographyPage) },
  { path: 'foundation/spacing', title: 'Spacing · Primal', loadComponent: () => import('./pages/foundation/spacing/spacing').then((m) => m.FoundationSpacingPage) },
  { path: 'foundation/shape', title: 'Radius, borders and elevation · Primal', loadComponent: () => import('./pages/foundation/shape/shape').then((m) => m.FoundationShapePage) },
  { path: 'foundation/motion', title: 'Motion · Primal', loadComponent: () => import('./pages/foundation/motion/motion').then((m) => m.FoundationMotionPage) },
  { path: 'foundation/themes', title: 'Themes · Primal', loadComponent: () => import('./pages/foundation/themes/themes').then((m) => m.FoundationThemesPage) },
  { path: 'foundation/direction', title: 'Direction · Primal', loadComponent: () => import('./pages/foundation/direction/direction').then((m) => m.FoundationDirectionPage) },
  { path: 'native/text', title: 'Text · Primal', loadComponent: () => import('./pages/native/text/text').then((m) => m.NativeTextPage) },
  { path: 'native/lists', title: 'Lists · Primal', loadComponent: () => import('./pages/native/lists/lists').then((m) => m.NativeListsPage) },
  { path: 'native/quotes-and-code', title: 'Quotes and code · Primal', loadComponent: () => import('./pages/native/quotes-and-code/quotes-and-code').then((m) => m.NativeQuotesAndCodePage) },
  { path: 'native/tables', title: 'Tables · Primal', loadComponent: () => import('./pages/native/tables/tables').then((m) => m.NativeTablesPage) },
  { path: 'native/media', title: 'Media · Primal', loadComponent: () => import('./pages/native/media/media').then((m) => m.NativeMediaPage) },
  { path: 'native/page-structure', title: 'Page structure · Primal', loadComponent: () => import('./pages/native/page-structure/page-structure').then((m) => m.NativePageStructurePage) },
  { path: 'native/coverage', title: 'Coverage · Primal', loadComponent: () => import('./pages/native/coverage/coverage').then((m) => m.NativeCoveragePage) },
  { path: 'forms/text-fields', title: 'Text fields · Primal', loadComponent: () => import('./pages/forms/text-fields/text-fields').then((m) => m.FormsTextFieldsPage) },
  { path: 'forms/choices', title: 'Choices · Primal', loadComponent: () => import('./pages/forms/choices/choices').then((m) => m.FormsChoicesPage) },
  { path: 'forms/pickers', title: 'Pickers · Primal', loadComponent: () => import('./pages/forms/pickers/pickers').then((m) => m.FormsPickersPage) },
  { path: 'forms/select', title: 'Select · Primal', loadComponent: () => import('./pages/forms/select/select').then((m) => m.FormsSelectPage) },
  { path: 'forms/form-structure', title: 'Form structure · Primal', loadComponent: () => import('./pages/forms/form-structure/form-structure').then((m) => m.FormsFormStructurePage) },
  { path: 'forms/validation', title: 'Validation · Primal', loadComponent: () => import('./pages/forms/validation/validation').then((m) => m.FormsValidationPage) },
  { path: 'forms/examples', title: 'Example forms · Primal', loadComponent: () => import('./pages/forms/examples/examples').then((m) => m.FormsExamplesPage) },
  { path: 'actions/actions', title: 'Actions · Primal', loadComponent: () => import('./pages/actions/actions/actions').then((m) => m.ActionsActionsPage) },
  { path: 'actions/feedback', title: 'Feedback · Primal', loadComponent: () => import('./pages/actions/feedback/feedback').then((m) => m.ActionsFeedbackPage) },
  { path: 'actions/behaviour-model', title: 'The behaviour model · Primal', loadComponent: () => import('./pages/actions/behaviour-model/behaviour-model').then((m) => m.ActionsBehaviourModelPage) },
  { path: 'actions/action-kinds', title: 'Action kinds · Primal', loadComponent: () => import('./pages/actions/action-kinds/action-kinds').then((m) => m.ActionsActionKindsPage) },
  { path: 'navigation/navigation', title: 'Navigation · Primal', loadComponent: () => import('./pages/navigation/navigation/navigation').then((m) => m.NavigationNavigationPage) },
  { path: 'navigation/disclosure', title: 'Disclosure · Primal', loadComponent: () => import('./pages/navigation/disclosure/disclosure').then((m) => m.NavigationDisclosurePage) },
  { path: 'navigation/dialogs', title: 'Dialogs · Primal', loadComponent: () => import('./pages/navigation/dialogs/dialogs').then((m) => m.NavigationDialogsPage) },
  { path: 'navigation/popovers', title: 'Popovers and tooltips · Primal', loadComponent: () => import('./pages/navigation/popovers/popovers').then((m) => m.NavigationPopoversPage) },
  { path: 'navigation/focus-and-keys', title: 'Focus and keys · Primal', loadComponent: () => import('./pages/navigation/focus-and-keys/focus-and-keys').then((m) => m.NavigationFocusAndKeysPage) },
  { path: 'content/content', title: 'Content · Primal', loadComponent: () => import('./pages/content/content/content').then((m) => m.ContentContentPage) },
  { path: 'content/information', title: 'Information · Primal', loadComponent: () => import('./pages/content/information/information').then((m) => m.ContentInformationPage) },
  { path: 'content/layout', title: 'Layout · Primal', loadComponent: () => import('./pages/content/layout/layout').then((m) => m.ContentLayoutPage) },
  { path: 'content/cells', title: 'Cells · Primal', loadComponent: () => import('./pages/content/cells/cells').then((m) => m.ContentCellsPage) },
  { path: 'surfaces/authentication', pathMatch: 'full', redirectTo: 'surfaces/authentication/sign-in' },
  { path: 'surfaces/authentication/:mode', title: 'Authentication · Primal', loadComponent: () => import('./pages/surfaces/authentication/authentication').then((m) => m.SurfacesAuthenticationPage) },
  { path: 'surfaces/app-shell', title: 'App shell · Primal', loadComponent: () => import('./pages/surfaces/app-shell/app-shell').then((m) => m.SurfacesAppShellPage) },
  { path: 'surfaces/settings', pathMatch: 'full', redirectTo: 'surfaces/settings/profile' },
  { path: 'surfaces/settings/:section', title: 'Settings · Primal', loadComponent: () => import('./pages/surfaces/settings/settings').then((m) => m.SurfacesSettingsPage) },
  { matcher: listDetail, title: 'List and detail · Primal', loadComponent: () => import('./pages/surfaces/list-detail/list-detail').then((m) => m.SurfacesListDetailPage) },
  { path: 'surfaces/multi-step-form', title: 'Multi-step form · Primal', loadComponent: () => import('./pages/surfaces/multi-step-form/multi-step-form').then((m) => m.SurfacesMultiStepFormPage) },
  { path: 'contracts/catalog', title: 'Contract catalog · Primal', loadComponent: () => import('./pages/contracts/catalog/catalog').then((m) => m.ContractsCatalogPage) },
  { path: '**', title: 'Not found · Primal', loadComponent: () => import('./pages/not-found/not-found').then((m) => m.NotFoundPage) },
];
