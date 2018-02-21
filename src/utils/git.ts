import { Context } from '../context';
import { exec } from './promises';

export const git = {
  getBranch: async (branch: string, remote?: string): Promise<void> => {
    const current = await git.current();
    if (!remote) {
      remote = (await git.remotes())[0];
    }
    console.log(`git checkout ${branch} && git checkout ${current}`);
    try {
      await exec('git remote update && git fetch');
      await exec(`git pull ${remote} ${branch}`);
      await exec(`git checkout ${branch} && git checkout ${current}`);
    } catch (error) {
      const fetchProp = 'remote.origin.fetch';
      const initialFetchValue = await git.config(fetchProp)!;
      const desiredFetchValue = '+refs/heads/*:refs/remotes/origin/*';
      if (initialFetchValue === desiredFetchValue) {
        console.log(error);
        return;
      }
      console.log(`Could not pull "${branch}" branch from remote "${remote}".
      Trying to do so replacing "${fetchProp}" before.`);
      await git.config(fetchProp, desiredFetchValue);
      await exec(`git pull ${remote} ${branch}`);
      await exec(`git checkout ${branch} && git checkout ${current}`);
      await git.config(fetchProp, initialFetchValue);
    }
  },
  config: async (key: string, value?: string): Promise<string> => {
    if (value === undefined) {
      return (await exec(`git config ${key}`)).stdout.trim();
    }
    return (await exec(`git config ${key} ${value}`)).stdout.trim();
  },
  current: async (): Promise<string> => {
    const branch = await exec('git branch');
    const name = branch.stdout.match(/\* (.+)/)[1];
    const commit = name.match(/\(.+ detached at (.+)\)/);
    return (await exec(`git rev-parse ${commit ? commit[1] : name}`)).stdout;
  },
  remotes: async (): Promise<string[]> =>
    (await exec('git remote')).stdout.split('\n').filter(remote => !!remote),
  diff: async (ctx: Context, fileName: string): Promise<string> => {

    // const current = await git.current();
    const base = ctx.config.git.baseBranch;
    try {
      return (await exec(`git diff ${base}:./ -U0 ${fileName}`)).stdout;
    } catch (ignored) {
      console.log(`Failed to perform diff on ${fileName}. Trying to fetch ${base} branch before.`);
      await git.getBranch(base);
    }
    console.log(`git diff ${base}:./ -U0 ${fileName}`);
    return (await exec(`git diff ${base}:./ -U0 ${fileName}`)).stdout;
  },
};
