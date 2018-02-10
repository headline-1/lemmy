import { Context } from '../context';
import { git } from '../utils/git';

interface Params {
  name: 'changelog';
  file?: string;
}

export default async (ctx: Context, params: Params) => {
  ctx.message.section('Changelog');

  if (!params.file) {
    params.file = 'CHANGELOG.md';
  }
  const diff = (await git.diff(ctx, params.file)).trim();
  const removed = diff.match(/^-/gm);
  const added = diff.match(/^\+/gm);
  if (!added || (removed && added.length < removed.length)) {
    ctx.message.add(`:pencil: Please include the changes in \`${params.file}\` file`);
  } else {
    ctx.message.add(':tada: Changelog has been updated properly.');
  }
};