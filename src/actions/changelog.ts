import { Context } from '../context';
import { git } from '../utils/git';

interface Params {
  name: 'changelog';
  file?: string;
}

export default async (ctx: Context, params: Params) => {
  if (!params.file) {
    params.file = 'CHANGELOG.md';
  }
  const diff = (await git.diff(ctx, params.file)).trim();
  const removed = diff.match(/^-/g);
  const added = diff.match(/^\+/g);
  if (!added || (removed && added.length < removed.length)) {
    ctx.message.section('Changelog');
    ctx.message.add(`:pencil: Please include the changes in \`${params.file}\` file`);
  }
};
