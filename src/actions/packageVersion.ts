import { Context } from '../context';
import { git } from '../utils/git';

interface Params {
  name: 'version';
  file?: string;
}

export default async (ctx: Context, params: Params) => {
  if (!params.file) {
    params.file = 'package.json';
  }
  const diff = (await git.diff(ctx, params.file)).trim();
  const versionChange = diff.match(/^[-+]\s+("version"\s*:\s*"\d+\.\d+\.\d+")/gm);
  ctx.message.section('Version');
  if (!versionChange) {
    ctx.message.add(`:warning: You probably forgot to update the package version.`);
  } else {
    ctx.message.add(':tada: Package version has been updated properly.');
  }
};
