import { Context } from '../context';
import { exec } from './promises';

export const git = {
  current: async (): Promise<string> => {
    const branch = await exec('git branch');
    return branch.stdout.match(/\* (.+)/)[1];
  },
  getBranch: async (branch: string): Promise<void> => {
    const current = await git.current();
    await exec('git fetch');
    await exec(`git checkout ${branch}`);
    await exec(`git checkout ${current}`);
  },
  diff: async (ctx: Context, fileName: string): Promise<string> => {
    // const current = await git.current();
    const base = ctx.config.git.baseBranch;
    try {
      return (await exec(`git diff ${base}:./ -U0 ${fileName}`)).stdout;
    } catch (ignored) {
      await git.getBranch(base);
    }
    return (await exec(`git diff ${base}:./ -U0 ${fileName}`)).stdout;
  },
};
