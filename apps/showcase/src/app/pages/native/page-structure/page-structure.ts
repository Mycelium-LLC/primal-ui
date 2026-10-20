import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PagePlaceholder } from '../../../shell/page-placeholder/page-placeholder';

/** Placeholder until 0.2.0: the plain native elements this page will cover (decision 10). */
@Component({
  selector: 'pr-native-page-structure-page',
  imports: [PagePlaceholder],
  templateUrl: './page-structure.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NativePageStructurePage {}
