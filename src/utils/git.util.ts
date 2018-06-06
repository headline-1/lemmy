import { Context } from '../context';
import { exec } from './promises.util';

const GIT_OPTIONS = { env: { LANG: 'en_US', ...process.env } };

export const git = {
  getBranch: async (branch: string, remote?: string): Promise<void> => {
    if (!remote) {
      remote = (await git.remotes())[0];
    }
    const currentBranch = await git.current();
    const fetchProp = 'remote.origin.fetch';
    const initialFetchValue = await git.config(fetchProp)!;
    const desiredFetchValue = '+refs/heads/*:refs/remotes/origin/*';
    await git.config(fetchProp, desiredFetchValue);
    await exec('git remote update && git fetch', GIT_OPTIONS);
    const stashed = !(await exec('git stash', GIT_OPTIONS)).stdout.match(/No local changes to save/);
    await exec(`git pull ${remote} ${branch}:${branch}`, GIT_OPTIONS);
    await exec(`git checkout ${branch}`, GIT_OPTIONS);
    await exec(`git reset --hard ${remote}/${branch}`, GIT_OPTIONS);
    await exec(`git checkout ${currentBranch}`, GIT_OPTIONS);
    if (stashed) {
      await exec('git stash pop', GIT_OPTIONS);
    }
    await git.config(fetchProp, initialFetchValue);
  },
  config: async (key: string, value?: string): Promise<string> => {
    if (value === undefined) {
      return (await exec(`git config ${key}`, GIT_OPTIONS)).stdout.trim();
    }
    return (await exec(`git config ${key} ${value}`, GIT_OPTIONS)).stdout.trim();
  },
  current: async (): Promise<string> => {
    const branch = await exec('git branch');
    const name = branch.stdout.match(/\* (.+)/)[1];
    const commit = name.match(/\(.+ detached at (.+)\)/);
    return (await exec(`git rev-parse ${commit ? commit[1] : name}`, GIT_OPTIONS)).stdout;
  },
  remotes: async (): Promise<string[]> =>
    (await exec('git remote', GIT_OPTIONS)).stdout.split('\n').filter(remote => !!remote),
  diff: async (ctx: Context, fileName: string): Promise<string> => {

    const base = ctx.config.git.baseBranch;
    try {
      return (await exec(`git diff ${base}:./ -U0 ${fileName}`, GIT_OPTIONS)).stdout;
    } catch (ignored) {
      console.log(`Failed to perform diff on ${fileName}. Trying to fetch ${base} branch before.`);
      await git.getBranch(base);
    }
    return (await exec(`git diff ${base}:./ -U0 ${fileName}`, GIT_OPTIONS)).stdout;
  },
};
