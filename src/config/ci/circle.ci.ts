import {exec} from '../../utils/promises';
import { undefinedIfFalse } from '../../utils/general';

export module Circle {
  export const config = async () => {
    const config = {
      git: {
        baseBranch: process.env.CIRCLE_BRANCH,
        repo: process.env.CIRCLE_PROJECT_USERNAME + '/' + process.env.CIRCLE_PROJECT_REPONAME,
        pull: undefinedIfFalse(process.env.CIRCLE_PR_NUMBER),
        commit: process.env.CIRCLE_SHA1,
      },
      ci: {
        name: 'Circle',
        os: process.env.TRAVIS_OS_NAME,
        buildNumber: process.env.CIRCLE_BUILD_NUM,
        jobNumber: process.env.CIRCLE_JOB,
        buildDir: process.env.CIRCLE_WORKING_DIRECTORY,
      },
    };
    if (config.git.pull) {
      // Workaround for missing Circle feature.
      // See: https://discuss.circleci.com/t/how-to-get-the-pull-request-upstream-branch/5496
      config.git.pull = (await exec(
        `curl -fsSL https://api.github.com/repos/${config.git.repo}/pulls/${config.git.pull} | jq -r '.base.ref'`
      )).stdout;
    }
    return config;
};
