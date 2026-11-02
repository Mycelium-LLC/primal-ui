import { ChangeDetectionStrategy, Component, DestroyRef, afterNextRender, computed, contentChild, inject, input, signal } from '@angular/core';
import { PrimalAnnouncer } from '../behaviour/announcer';
import { PrimalControl } from './control';

/** A file as the list shows it. */
interface Picked {
  readonly name: string;
  readonly size: string;
}

/** 1536 → "1.5 KB". */
export function primalFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const units = ['KB', 'MB', 'GB'];
  let n = bytes / 1024;
  let u = 0;
  while (n >= 1024 && u < units.length - 1) {
    n /= 1024;
    u++;
  }
  return `${n < 10 ? n.toFixed(1) : Math.round(n)} ${units[u]}`;
}

/** Does a file match the input's accept list (".pdf", "image/*", "application/json")? */
function accepts(accept: string, file: File): boolean {
  if (!accept.trim()) return true;
  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();
  return accept
    .split(',')
    .map((a) => a.trim().toLowerCase())
    .some((a) => (a.startsWith('.') ? name.endsWith(a) : a.endsWith('/*') ? type.startsWith(a.slice(0, -1)) : type === a));
}

/**
 * A file field with a drop zone: a target big enough to drop files on, or to click. The native
 * input covers the zone, so the browser's own picker, dropping and the keyboard all work; the
 * files chosen are listed with their sizes, each with a way to take it back out. A file the
 * input does not accept is turned away, and the zone says which and why.
 *
 *   <primal-field label="Attachments" description="PDFs or images, up to 10 MB each.">
 *     <primal-file-drop>
 *       <input primalControl type="file" accept=".pdf,image/*" multiple />
 *     </primal-file-drop>
 *   </primal-field>
 */
@Component({
  selector: 'primal-file-drop',
  template: `
    <div class="pr-drop-zone" [attr.data-dragging]="dragging() ? '' : null">
      <svg class="pr-drop-zone-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M12 15V4m-4 4 4-4 4 4" /><path d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
      </svg>
      <p class="pr-drop-zone-words" aria-hidden="true">
        @if (dragging()) {
          {{ dropWords() }}
        } @else {
          {{ dragWords() }}<span class="pr-drop-zone-choose">{{ chooseWords() }}</span>
        }
      </p>
      <ng-content />
    </div>
    @if (turnedAway()) {
      <p class="pr-field-message" role="status">{{ turnedAway() }}</p>
    }
    @if (picked().length) {
      <ul class="pr-file-list" [attr.aria-label]="'Chosen ' + (multiple() ? 'files' : 'file')">
        @for (f of picked(); track f.name + $index) {
          <li>
            <span class="pr-file-name">{{ f.name }}</span>
            <span class="pr-file-size">{{ f.size }}</span>
            <button type="button" class="pr-icon-button pr-button-quiet" [attr.aria-label]="'Remove ' + f.name" [attr.title]="'Remove ' + f.name" (click)="remove($index)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>
            </button>
          </li>
        }
      </ul>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrimalFileDrop {
  /** The zone's words: "Drag files here, or " + "choose them". */
  readonly dragWords = input('Drag files here, or ');
  readonly chooseWords = input('choose them');
  /** While a file is over the zone. */
  readonly dropWords = input('Drop to add');

  private readonly control = contentChild.required(PrimalControl);
  private readonly el = computed(() => this.control().element as HTMLInputElement);
  private readonly announcer = inject(PrimalAnnouncer);

  protected readonly dragging = signal(false);
  protected readonly picked = signal<Picked[]>([]);
  protected readonly multiple = signal(false);
  protected readonly turnedAway = signal<string | null>(null);

  constructor() {
    const destroy = inject(DestroyRef);
    afterNextRender(() => {
      const el = this.el();
      this.multiple.set(el.multiple);
      // Dragging over the zone's children fires enter and leave in pairs: count them.
      let depth = 0;
      const enter = (e: DragEvent) => {
        if (!e.dataTransfer?.types.includes('Files') || el.disabled) return;
        depth++;
        this.dragging.set(true);
      };
      const leave = () => {
        depth = Math.max(0, depth - 1);
        if (!depth) this.dragging.set(false);
      };
      const drop = () => {
        depth = 0;
        this.dragging.set(false);
      };
      const change = () => this.take();
      el.addEventListener('dragenter', enter);
      el.addEventListener('dragleave', leave);
      el.addEventListener('drop', drop);
      el.addEventListener('change', change);
      this.read();
      destroy.onDestroy(() => {
        el.removeEventListener('dragenter', enter);
        el.removeEventListener('dragleave', leave);
        el.removeEventListener('drop', drop);
        el.removeEventListener('change', change);
      });
    });
  }

  /** Keeps what the input accepts, says what it turned away, and lists the rest. */
  private take(): void {
    const el = this.el();
    const files = [...(el.files ?? [])];
    const kept = files.filter((f) => accepts(el.accept, f));
    const away = files.filter((f) => !kept.includes(f));
    if (away.length) {
      this.set(kept);
      const names = away.map((f) => `“${f.name}”`).join(', ');
      this.turnedAway.set(`${names} ${away.length === 1 ? "isn't" : "aren't"} a kind of file this field takes, so ${away.length === 1 ? 'it was' : 'they were'} left out.`);
    } else {
      this.turnedAway.set(null);
    }
    this.read();
    if (kept.length) this.announcer.announce(kept.length === 1 ? `Added ${kept[0].name}.` : `Added ${kept.length} files.`);
  }

  protected remove(index: number): void {
    const files = [...(this.el().files ?? [])];
    const [gone] = files.splice(index, 1);
    this.set(files);
    this.turnedAway.set(null);
    this.read();
    this.el().dispatchEvent(new Event('input', { bubbles: true }));
    this.el().dispatchEvent(new Event('change', { bubbles: true }));
    if (gone) this.announcer.announce(`Removed ${gone.name}.`);
    this.el().focus();
  }

  private set(files: File[]): void {
    const list = new DataTransfer();
    for (const f of files) list.items.add(f);
    this.el().files = list.files;
  }

  private read(): void {
    this.picked.set([...(this.el().files ?? [])].map((f) => ({ name: f.name, size: primalFileSize(f.size) })));
  }
}
