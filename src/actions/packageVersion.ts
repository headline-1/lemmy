import { Action } from '../action.interface';
import { Context } from '../context';
import { git } from '../utils/git.util';

interface Params {
  file: string;
}

export const action: Action<Params> = {
  name: 'packageVersion',
  description: 'Makes sure that version in `package.json` file has been changed',
  args: [
    { name: 'file', type: 'string', description: 'path to a lint report file in repository', default: 'package.json' },
  ],
  execute: async (ctx: Context, params: Params) => {
    const diff = (await git.diff(ctx, params.file)).trim();
    const versionChange = diff.match(/^[-+]\s+("version"\s*:\s*"\d+\.\d+\.\d+")/gm);
    ctx.message.section('Version');
    if (!versionChange) {
      ctx.message.add(`:warning: You probably forgot to update the package version.`);
    } else {
      ctx.message.add(':tada: Package version has been updated properly.');
    }
  },
};
