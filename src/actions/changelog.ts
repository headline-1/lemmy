import { Action } from '../action.interface';
import { Context } from '../context';
import { git } from '../utils/git';

interface Params {
  file?: string;
}

export const action: Action<Params> = {
  name: 'changelog',
  description: 'Checks if changes were performed in changelog file.',
  args: [
    {
      name: 'file',
      type: 'string',
      description: 'path to changelog file in repository',
      default: 'CHANGELOG.md',
    },
  ],
  execute: async (ctx: Context, params: Params) => {
    ctx.message.section('Changelog');

    const diff = (await git.diff(ctx, params.file)).trim();
    const removed = diff.match(/^-/gm);
    const added = diff.match(/^\+/gm);
    if (!added || (removed && added.length < removed.length)) {
      ctx.message.add(`:pencil: Please include the changes in \`${params.file}\` file`);
    } else {
      ctx.message.add(':tada: Changelog has been updated properly.');
    }
  },
};
