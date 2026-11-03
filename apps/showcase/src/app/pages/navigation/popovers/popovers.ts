import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PRIMAL_ACTIONS, PRIMAL_FORMS, PRIMAL_TOP_LAYERS } from '@mycelium-llc/primal-angular';
import { PlainHtml } from '../../../shell/plain-html/plain-html';

@Component({
  selector: 'pr-navigation-popovers-page',
  imports: [PRIMAL_TOP_LAYERS, PRIMAL_ACTIONS, PRIMAL_FORMS, PlainHtml],
  templateUrl: './popovers.html',
  styleUrl: '../../actions/actions-pages.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationPopoversPage {
  protected readonly copy = async () => {
    await navigator.clipboard?.writeText('https://primal.example/r/q3-revenue').catch(() => undefined);
    return 'Copied';
  };

  protected readonly plain = `<!-- A popover: the browser opens, closes and stacks it. Place it with CSS anchor positioning, or script. -->
<button type="button" popovertarget="share">Copy Share Link</button>
<div id="share" class="pr-layer" popover role="dialog" aria-label="Share link">…</div>

<!-- A tooltip needs script to show on hover and focus; this is its markup. -->
<button type="button" class="pr-icon-button pr-button-quiet" aria-label="Edit Name" aria-describedby="tip-1">…</button>
<div id="tip-1" class="pr-tooltip" role="tooltip" popover="manual">Edit name</div>`;
}
