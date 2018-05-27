import { Action } from '../action.interface';
import { Context } from '../context';
import { asCode, asCollapsedPath } from '../utils/message';
import { readFile } from '../utils/promises';

interface Params {
  header: string;
  file: string;
}

interface Failure {
  endPosition: {
    character: number;
    line: number;
    position: number;
  };
  startPosition: {
    character: number;
    line: number;
    position: number;
  };
  failure: string;
  name: string;
  ruleName: string;
  ruleSeverity: string;
}

export const action: Action<Params> = {
  name: 'lint',
  description: 'Prepares a report from linter\'s JSON output. Tested with TSLint.',
  args: [
    { name: 'header', type: 'string', description: 'a custom header', default: 'Lint' },
    { name: 'file', type: 'string', description: 'path to a lint report file in repository', required: true },
  ],
  execute: async (ctx: Context, params: Params) => {
    ctx.message.section(params.header);
    let file: Failure[];
    try {
      file = JSON.parse(await readFile(params.file, 'utf-8'));
    } catch (ignored) {
      throw new Error(`Could not read report file at "${params.file}". It may not exist or it's not in JSON format.`);
    }
    if (file.length === 0) {
      ctx.message.add(':tada: No lint warnings were reported!');
      return;
    }
    ctx.message.error('Linter reported errors.');
    const table = [['Location', 'Line', 'Failure', 'Rule']];
    file.forEach((fail) => {
      table.push([
        asCollapsedPath(fail.name.replace(ctx.config.ci.buildDir, '')),
        asCode(`${fail.startPosition.line}:${fail.startPosition.character}`),
        fail.failure,
        fail.ruleName,
      ]);
    });
    ctx.message.table(table);
  },
};
