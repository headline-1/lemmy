import { platform } from 'os';
import { undefinedIfFalse } from '../../utils/general.util';
import { exec } from '../../utils/promises.util';
import { Config } from '../config.interface';

export module Circle {

  const extractPullId = (pullPath: string) => undefinedIfFalse(pullPath)
    ? pullPath.substring(pullPath.lastIndexOf('/') + 1)
    : undefined;

  const extractBaseBranch = async (repo: string, pull: string) => {
    if (pull) {
      // Workaround for missing Circle feature.
      // See: https://discuss.circleci.com/t/how-to-get-the-pull-request-upstream-branch/5496
      return (await exec(
        `curl -fsSL https://api.github.com/repos/${repo}/pulls/${pull} | jq -r '.base.ref'`
      )).stdout;
    }
    return undefined;
  };

  export const config = async (): Promise<Partial<Config>> => {
    if (!process.env.CIRCLECI) {
      return {};
    }
    const pull = extractPullId(process.env.CIRCLE_PULL_REQUEST);
    const repo = process.env.CIRCLE_PROJECT_USERNAME + '/' + process.env.CIRCLE_PROJECT_REPONAME;
    const baseBranch = await extractBaseBranch(repo, pull);

    return {
      git: {
        baseBranch,
        repo,
        pull,
        commit: process.env.CIRCLE_SHA1,
      },
      ci: {
        name: 'Circle',
        os: platform(),
        buildNumber: process.env.CIRCLE_BUILD_NUM,
        jobNumber: process.env.CIRCLE_JOB,
        buildDir: process.env.CIRCLE_WORKING_DIRECTORY,
      },
    };
  };
}
