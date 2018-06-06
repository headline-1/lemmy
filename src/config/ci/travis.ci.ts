import { undefinedIfFalse } from '../../utils/general';

export module Travis {
  export const config = async () => ({
    git: {
      baseBranch: process.env.TRAVIS_BRANCH,
      repo: process.env.TRAVIS_REPO_SLUG,
      pull: undefinedIfFalse(process.env.TRAVIS_PULL_REQUEST),
      commit: process.env.TRAVIS_COMMIT,
    },
    ci: {
      name: 'Travis',
      os: process.env.TRAVIS_OS_NAME,
      buildNumber: process.env.TRAVIS_BUILD_NUMBER,
      jobNumber: process.env.TRAVIS_JOB_NUMBER,
      buildDir: process.env.TRAVIS_BUILD_DIR,
    },
  });
}
