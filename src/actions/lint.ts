import { Context } from '../context';
import { git } from '../utils/git';
import { readFile } from '../utils/promises';

interface Params {
  name: 'changelog';
  file?: string;
}

export default async (ctx: Context, params: Params) => {
  const file = JSON.parse(await readFile(params.file, 'utf-8'));
  if (!added || (removed && added.length < removed.length)) {
    ctx.message.section('Lint');
  }
};
