import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, viewChild } from '@angular/core';
import { CoverageTable } from '../../../shell/coverage-table/coverage-table';

@Component({
  selector: 'pr-native-media-page',
  imports: [CoverageTable],
  templateUrl: './media.html',
  styleUrl: './media.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NativeMediaPage implements AfterViewInit {
  private readonly canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('chart');

  /** Draws a small bar chart in the page's own colours, so the canvas has something real to show. */
  ngAfterViewInit(): void {
    const el = this.canvas().nativeElement;
    const ctx = el.getContext('2d');
    if (!ctx) return;
    const css = getComputedStyle(el);
    const bars = [3, 5, 4, 7, 6, 8, 5]; // MOCK DATA: builds per day
    const w = el.width / bars.length;
    ctx.fillStyle = css.getPropertyValue('--pr-color-primary').trim() || 'gray';
    bars.forEach((b, i) => ctx.fillRect(i * w + 4, el.height - b * 14, w - 8, b * 14));
  }
}
