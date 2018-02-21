import { Context } from '../context';
import { readFile } from '../utils/promises';

interface Params {
  name: 'changelog';
  header: string;
  file?: string;
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

export default async (ctx: Context, params: Params) => {
  ctx.message.section(params.header || 'Lint');
  if (!params.file) {
    throw new Error('No "file" param specified. Please enter path to a JSON lint report file.');
  }
  let file: Failure[];
  try {
    file = JSON.parse(await readFile(params.file, 'utf-8'));
  } catch (_) {
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
      `\`${fail.name.replace(ctx.config.ci.buildDir, '')}\``,
      `\`${fail.startPosition.line}:${fail.startPosition.character}\``,
      fail.failure,
      fail.ruleName,
    ]);
  });
  ctx.message.table(table);
};
