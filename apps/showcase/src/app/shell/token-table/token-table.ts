import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { PRIMAL_TABLES } from 'primal-angular';
import { Token } from '../tokens';

/** A plain reference table of tokens: name, value and meaning, straight from the token source. */
@Component({
  selector: 'pr-token-table',
  imports: [PRIMAL_TABLES],
  template: `
    <div class="pr-table-scroll">
      <table>
        <caption>{{ caption() }}</caption>
        <thead>
          <tr>
            <th scope="col">Token</th>
            <th scope="col">Value</th>
            <th scope="col">Meaning</th>
          </tr>
        </thead>
        <tbody>
          @for (token of tokens(); track token.name) {
            <tr>
              <th scope="row"><code>{{ token.name }}</code></th>
              <td><code>{{ token.value }}</code></td>
              <td>{{ token.meaning }}</td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
  styleUrl: './token-table.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TokenTable {
  readonly caption = input.required<string>();
  readonly tokens = input.required<Token[]>();
}
