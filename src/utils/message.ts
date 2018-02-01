export class Message {
  private body: string;

  add = (message: string): this => {
    this.body += `${message}\n`;
    return this;
  };

  section = (name: string): this => {
    this.body += `\n### ${name}\n`;
    return this;
  };

  table = (table: string[][]) => {
    this.body += '\n' + table.map((row, index) =>
      // Join the row elements with pipe
      row.map(value => value.replace(/\|/g, '\|')).join(' | ') +
      // Add hyphens below headers
      ((index === 0) ? '\n' + Array(row.length).fill('---').join(' | ') : '')
    ).join('\n') + '\n\n';
  };

  get = (): string => this.body;

}
