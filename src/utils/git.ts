import { Context } from '../context';
import { exec } from './promises';

export const git = {
  current: async (): Promise<string> => {
    const branch = await exec('git branch');
    return branch.stdout.match(/\* (.+)/)[1];
  },
  diff: async (ctx: Context, fileName: string): Promise<string> => {
    const current = await git.current();
    const base = ctx.config.git.baseBranch || 'master';
    return (await exec(`git diff ${base}...${current} ${fileName}`)).stdout;
  },
};
