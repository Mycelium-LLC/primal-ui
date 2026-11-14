import { Routes } from '@angular/router';
import { signedIn, signedOut } from './auth/auth';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'projects' },

  // The gate: each place at its own address, for signed-out visitors.
  { path: 'sign-in', title: 'Sign in · Field Notes', canMatch: [signedOut], loadComponent: () => import('./auth/sign-in').then((m) => m.SignIn) },
  { path: 'sign-up', title: 'Create your account · Field Notes', canMatch: [signedOut], loadComponent: () => import('./auth/sign-up').then((m) => m.SignUp) },
  { path: 'reset', title: 'Reset your password · Field Notes', canMatch: [signedOut], loadComponent: () => import('./auth/reset').then((m) => m.Reset) },

  // The product: every place inside the shell, for signed-in people.
  {
    path: '',
    canMatch: [signedIn],
    loadComponent: () => import('./shell/shell').then((m) => m.Shell),
    children: [
      { path: 'projects', title: 'Projects · Field Notes', loadComponent: () => import('./projects/projects').then((m) => m.Projects) },
      { path: 'projects/:slug', title: 'Project · Field Notes', loadComponent: () => import('./project/project').then((m) => m.ProjectPage) },
      { path: 'teams', title: 'Teams · Field Notes', loadComponent: () => import('./teams/teams').then((m) => m.Teams) },
      { path: 'teams/new', title: 'New team · Field Notes', loadComponent: () => import('./new-team/new-team').then((m) => m.NewTeam) },
      { path: 'settings', title: 'Settings · Field Notes', loadComponent: () => import('./settings/settings').then((m) => m.Settings) },
      { path: 'settings/:section', title: 'Settings · Field Notes', loadComponent: () => import('./settings/settings').then((m) => m.Settings) },
    ],
  },

  { path: '**', redirectTo: 'projects' },
];
