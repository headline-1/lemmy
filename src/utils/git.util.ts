import { Context } from '../context';
import { exec } from './promises.util';

const GIT_OPTIONS = { env: { LANG: 'en_US', ...process.env } };

export module Git {
  export const config = async (key: string, value?: string): Promise<string> => {
    if (value === undefined) {
      return (await exec(`git config ${key}`, GIT_OPTIONS)).stdout.trim();
    }
    return (await exec(`git config ${key} ${value}`, GIT_OPTIONS)).stdout.trim();
  };

  export const current = async (): Promise<string> => {
    const branch = await exec('git branch');
    const name = branch.stdout.match(/\* (.+)/)[1];
    const commit = name.match(/\(.+ detached at (.+)\)/);
    return (await exec(`git rev-parse ${commit ? commit[1] : name}`, GIT_OPTIONS)).stdout;
  };

  export const remotes = async (): Promise<string[]> => {
    const result = (await exec('git remote', GIT_OPTIONS));
    if (result.stderr) {
      throw new Error(`git.remotes(): ${result.stderr}`);
    }
    return (result.stdout as string).split('\n').filter(remote => !!remote);
  };

  export const getBranch = async (branch: string, remote?: string): Promise<void> => {
    if (!remote) {
      remote = (await remotes())[0];
    }
    const currentBranch = await current();
    const fetchProp = 'remote.origin.fetch';
    const initialFetchValue = await config(fetchProp)!;
    const desiredFetchValue = '+refs/heads/*:refs/remotes/origin/*';
    await config(fetchProp, desiredFetchValue);
    await exec('git remote update && git fetch', GIT_OPTIONS);
    const stashed = !(await exec('git stash', GIT_OPTIONS)).stdout.match(/No local changes to save/);
    await exec(`git pull ${remote} ${branch}:${branch}`, GIT_OPTIONS);
    await exec(`git checkout ${branch}`, GIT_OPTIONS);
    await exec(`git reset --hard ${remote}/${branch}`, GIT_OPTIONS);
    await exec(`git checkout ${currentBranch}`, GIT_OPTIONS);
    if (stashed) {
      await exec('git stash pop', GIT_OPTIONS);
    }
    await config(fetchProp, initialFetchValue);
  };

  export const assureBranchIsInSync = async (ctx: Context): Promise<void> => {
    const { baseBranch, isBaseBranchSynchronized } = ctx.config.git;
    if (!isBaseBranchSynchronized) {
      await getBranch(baseBranch);
      ctx.config.git.isBaseBranchSynchronized = true;
    }
  };

  export const diff = async (ctx: Context, fileName: string): Promise<string> => {
    await assureBranchIsInSync(ctx);
    return (await exec(`git diff ${ctx.config.git.baseBranch}:./ -U0 ${fileName}`, GIT_OPTIONS)).stdout;
  };
}
