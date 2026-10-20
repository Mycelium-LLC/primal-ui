import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'pr-not-found-page',
  imports: [RouterLink],
  template: `
    <h1>No page here</h1>
    <p>This address isn't part of the showcase. <a routerLink="/">Go to the Overview</a></p>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundPage {}
