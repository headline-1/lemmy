import { Context } from '../context';
import { git } from '../utils/git';

interface Params {
  name: 'version';
  file?: string;
}

export default async (ctx: Context, params: Params) => {
  const diff = (await git.diff(ctx, params.file)).trim();
  const versionChange = diff.match(/^[-+]\s+("version"\s*:\s*"\d+\.\d+\.\d+")/);
  if (!versionChange) {
    ctx.message.section('Version');
    ctx.message.add(`:warning: You probably forgot to update the package version.`);
  }
};
