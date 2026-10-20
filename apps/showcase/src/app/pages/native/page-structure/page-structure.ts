import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CoverageTable } from '../../../shell/coverage-table/coverage-table';

@Component({
  selector: 'pr-native-page-structure-page',
  imports: [CoverageTable],
  templateUrl: './page-structure.html',
  styleUrl: './page-structure.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NativePageStructurePage {
  protected readonly skeleton = `<body>
  <header>…the name, and global navigation in a <nav>…</header>
  <main>
    <article>
      <hgroup><h1>Title</h1><p>Subtitle</p></hgroup>
      <section><h2>A part</h2>…</section>
    </article>
    <aside>…related, but not the point…</aside>
  </main>
  <footer>…who, when, and the fine print…</footer>
</body>`;
}
