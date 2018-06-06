export enum TableAlignment {
  Left,
  Right,
  Center,
}

export const bold = (text: string) =>
  `<bold>${text}</bold>`;

export const asCode = (text: string) =>
  text.split('\n')
    .map(text => `<code>${text
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      }</code>`
    )
    .join('<br>');

export const asCollapsedPath = (path: string) =>
  `<details><summary>${path.slice(path.lastIndexOf('/') + 1)}</summary><code>${path}</code></details>`;

export class Message {
  private body: string = '';

  add = (message: string): this => {
    this.body += `${message}\n`;
    return this;
  };

  error = (message: string): this =>
    this.add(`\n:exclamation: <b>${message.trim()}</b>`);

  section = (name: string): this => {
    this.body += `\n### ${name}\n`;
    return this;
  };

  collapsibleSection = (name: string): this => {
    this.body += `\n<details><summary>${name}</summary><p>\n`;
    return this;
  };
  collapsibleSectionEnd = (): this => {
    this.body += `\n</p></details>\n`;
    return this;
  };

  table = (table: (string | number | boolean)[][], align?: TableAlignment[]): this => {
    this.body += '\n' + table.filter(row => !!row).map((row, index) =>
        // Join the row elements with pipe
      '| ' + row.map(value => value.toString()
        .replace(/\|/g, '&#124;')
        .replace(/\n/g, '<br>')
      ).join(' | ') + ' |' +
      // Add hyphens below headers
      ((index === 0) ? (
          '\n' + Array(row.length)
            .fill('---')
            .map((element, i) => {
              if (align) {
                switch (align[i]) {
                  case TableAlignment.Center:
                    return ':---:';
                  case TableAlignment.Right:
                    return '---:';
                  case TableAlignment.Left:
                  default:
                    return ':---';
                }
              }
              return element;
            })
            .join(' | ')
        ) : ''
      )
    ).join('\n') + '\n\n';
    return this;
  };

  get = (): string => this.body;

}
