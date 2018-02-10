export enum TableAlignment {
  Left,
  Right,
  Center,
}

export class Message {
  private body: string = '';

  add = (message: string): this => {
    this.body += `${message}\n`;
    return this;
  };

  error = (message: string): this =>
    this.add(`:exclamation: *${message}*`);

  section = (name: string): this => {
    this.body += `\n### ${name}\n`;
    return this;
  };

  table = (table: (string | number | boolean)[][], align?: TableAlignment[]) => {
    this.body += '\n' + table.filter(row => !!row).map((row, index) =>
      // Join the row elements with pipe
      row.map(value => value.toString()
        .replace(/\|/g, '\|')
        .replace(/\n/g, '<br>')
      ).join(' | ') +
      // Add hyphens below headers
      ((index === 0) ? '\n' + Array(row.length)
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
        .join(' | ') : '')
    ).join('\n') + '\n\n';
  };

  get = (): string => this.body;

}
