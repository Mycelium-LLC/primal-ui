import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', title: 'Projects', loadComponent: () => import('./projects/projects').then((m) => m.Projects) },
  { path: '**', redirectTo: '' },
];
